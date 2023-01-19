import FungibleToken from "./utility/FungibleToken.cdc"
import FungibleTokenMetadataViews from "./utility/FungibleTokenMetadataViews.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
import Toucans from "./Toucans.cdc"
import FlowToken from "./utility/FlowToken.cdc"
 
pub contract ExampleFinancial: FungibleToken {

    // The amount of tokens in existance
    pub var totalSupply: UFix64

    // Paths
    pub let VaultStoragePath: StoragePath
    pub let ReceiverPublicPath: PublicPath
    pub let VaultPublicPath: PublicPath
    pub let OwnerStoragePath: StoragePath

    // Events
    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)
    pub event TokensMinted(amount: UFix64)
    pub event TokensBurned(amount: UFix64)

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance, MetadataViews.Resolver {
        pub var balance: UFix64

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            
            // We set the balance to 0.0 here so that it doesn't
            // decrease the totalSupply in the `destroy` function.
            vault.balance = 0.0
            destroy vault
        }

        pub fun getViews(): [Type]{
            return [Type<FungibleTokenMetadataViews.FTView>(),
                    Type<FungibleTokenMetadataViews.FTDisplay>(),
                    Type<FungibleTokenMetadataViews.FTVaultData>()]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<FungibleTokenMetadataViews.FTView>():
                    return FungibleTokenMetadataViews.FTView(
                        ftDisplay: self.resolveView(Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                        ftVaultData: self.resolveView(Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                    )
                case Type<FungibleTokenMetadataViews.FTDisplay>():
                    let media = MetadataViews.Media(
                            file: MetadataViews.HTTPFile(
                            url: "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"
                        ),
                        mediaType: "image"
                    )
                    let medias = MetadataViews.Medias([media])
                    return FungibleTokenMetadataViews.FTDisplay(
                        name: "INSERT NAME",
                        symbol: "INSERT SYMBOL",
                        description: "INSERT DESCRIPTION",
                        externalURL: MetadataViews.ExternalURL("INSERT URL"),
                        logos: medias,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("INSERT TWITTER"),
                            "discord": MetadataViews.ExternalURL("INSERT DISCORD")
                        }
                    )
                case Type<FungibleTokenMetadataViews.FTVaultData>():
                    return FungibleTokenMetadataViews.FTVaultData(
                        storagePath: ExampleFinancial.VaultStoragePath,
                        receiverPath: ExampleFinancial.ReceiverPublicPath,
                        metadataPath: ExampleFinancial.VaultPublicPath,
                        providerPath: /private/ExampleFinancialVault,
                        receiverLinkedType: Type<&Vault{FungibleToken.Receiver}>(),
                        metadataLinkedType: Type<&Vault{FungibleToken.Balance, MetadataViews.Resolver}>(),
                        providerLinkedType: Type<&Vault{FungibleToken.Provider}>(),
                        createEmptyVaultFunction: (fun (): @Vault {
                            return <- ExampleFinancial.createEmptyVault()
                        })
                    )
            }
            return nil
        }

        init(balance: UFix64) {
            self.balance = balance
        }

        destroy() {
            ExampleFinancial.totalSupply = ExampleFinancial.totalSupply - self.balance
            emit TokensBurned(amount: self.balance)
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Minter: Toucans.Minter {
        pub fun mint(amount: UFix64): @Vault {
            return <- create Vault(balance: amount)
        }
    }

    init(
      _fundingTarget: UFix64,
      _issuanceRate: UFix64,
      _reserveRate: UFix64,
      _timeFrame: Toucans.CycleTimeFrame?,
      _payouts: [Toucans.Payout],
      _extra: {String: String}
    ) {

      // Contract Variables
      self.totalSupply = 0.0

      // Paths
      self.VaultStoragePath = /storage/ExampleFinancialVault
      self.ReceiverPublicPath = /public/ExampleFinancialReceiver
      self.VaultPublicPath = /public/ExampleFinancialMetadata
      self.OwnerStoragePath = /storage/ExampleFinancialOwner
 
      // Admin Setup
      let vault <- create Vault(balance: self.totalSupply)
      self.account.save(<-vault, to: self.VaultStoragePath)

      self.account.link<&Vault{FungibleToken.Receiver}>(
          self.ReceiverPublicPath,
          target: self.VaultStoragePath
      )

      self.account.link<&Vault{FungibleToken.Balance}>(
          self.VaultPublicPath,
          target: self.VaultStoragePath
      )

      if self.account.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
        self.account.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
        self.account.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
      }
      let toucansProjectCollection = self.account.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)!
      toucansProjectCollection.createProject(minter: <- create Minter())
      let ref = toucansProjectCollection.borrowProject(projectType: Type<@Vault>())!
      ref.configureFundingCycle(fundingTarget: _fundingTarget, issuanceRate: _issuanceRate, reserveRate: _reserveRate, timeFrame: _timeFrame, payouts: _payouts, extra: _extra)

      // Events
      emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
 