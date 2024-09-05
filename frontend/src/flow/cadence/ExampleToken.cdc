import FungibleToken from "./utility/FungibleToken.cdc"
import FungibleTokenMetadataViews from "./utility/FungibleTokenMetadataViews.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
import Toucans from "./Toucans.cdc"
import ToucansTokens from "./ToucansTokens.cdc"
import FlowToken from "./utility/FlowToken.cdc"
import ViewResolver from "./utility/ViewResolver.cdc"
 
access(all) contract ExampleToken: FungibleToken {

    // The amount of tokens in existance
    access(all) var totalSupply: UFix64
    // nil if there is none
    access(all) let maxSupply: UFix64?

    // Paths
    access(all) let VaultStoragePath: StoragePath
    access(all) let ReceiverPublicPath: PublicPath
    access(all) let VaultPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath
    access(all) let AdministratorStoragePath: StoragePath

    // Events
    access(all) event TokensTransferred(amount: UFix64, from: Address, to: Address)
    access(all) event TokensMinted(amount: UFix64)
    access(all) event TokensBurned(amount: UFix64)

    access(all) resource Vault: FungibleToken.Vault {
        access(all) var balance: UFix64

        /// Called when a fungible token is burned via the `Burner.burn()` method
        access(contract) fun burnCallback() {
            if self.balance > 0.0 {
                emit TokensBurned(amount: self.balance)
                ExampleToken.totalSupply = ExampleToken.totalSupply - self.balance
            }
            self.balance = 0.0
        }

        access(FungibleToken.Withdraw) fun withdraw(amount: UFix64): @{FungibleToken.Vault} {
            self.balance = self.balance - amount

            if let owner: Address = self.owner?.address {
                ExampleToken.setBalance(address: owner, balance: self.balance)
            }
            return <- create Vault(balance: amount)
        }

        access(all) fun deposit(from: @{FungibleToken.Vault}) {
            let vault: @Vault <- from as! @Vault
            self.balance = self.balance + vault.balance
            destroy vault

            if let owner: Address = self.owner?.address {
                ExampleToken.setBalance(address: owner, balance: self.balance)
            }
        }

        access(all) view fun getViews(): [Type] {
            return ExampleToken.getContractViews(resourceType: nil)
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            return ExampleToken.resolveContractView(resourceType: nil, viewType: view)
        }

        access(all) view fun isAvailableToWithdraw(amount: UFix64): Bool {
            return amount <= self.balance
        }

        access(all) fun createEmptyVault(): @Vault {
            return <- create Vault(balance: 0.0)
        }
  
        init(balance: UFix64) {
            self.balance = balance
        }
    }

    access(all) fun createEmptyVault(vaultType: Type): @Vault {
        return <- create Vault(balance: 0.0)
    }

    access(all) resource Minter: Toucans.Minter {
        access(all) fun mint(amount: UFix64): @Vault {
            post {
                ExampleToken.maxSupply == nil || ExampleToken.totalSupply <= ExampleToken.maxSupply!: 
                    "Exceeded the max supply of tokens allowd."
            }
            ExampleToken.totalSupply = ExampleToken.totalSupply + amount
            emit TokensMinted(amount: amount)
            return <- create Vault(balance: amount)
        }
    }

    // We follow this pattern of storage
    // so the (potentially) huge dictionary 
    // isn't loaded when the contract is imported
    access(all) resource Administrator {
        // This is an experimental index and should
        // not be used for anything official
        // or monetary related
        access(self) let balances: {Address: UFix64}

        access(contract) fun setBalance(address: Address, balance: UFix64) {
            self.balances[address] = balance
        }

        access(all) view fun getBalance(address: Address): UFix64 {
            return self.balances[address] ?? 0.0
        }

        access(all) view fun getBalances(): {Address: UFix64} {
            return self.balances
        }

        init() {
            self.balances = {}
        }
    }

    access(contract) fun setBalance(address: Address, balance: UFix64) {
        let admin: &Administrator = self.account.storage.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        admin.setBalance(address: address, balance: balance)
    }

    access(all) view fun getBalance(address: Address): UFix64 {
        let admin: &Administrator = self.account.storage.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        return admin.getBalance(address: address)
    }

    access(all) view fun getBalances(): {Address: UFix64} {
        let admin: &Administrator = self.account.storage.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        return admin.getBalances()
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<FungibleTokenMetadataViews.FTView>(),
            Type<FungibleTokenMetadataViews.FTDisplay>(),
            Type<FungibleTokenMetadataViews.FTVaultData>(),
            Type<FungibleTokenMetadataViews.TotalSupply>()
        ]
    }

    access(all) view fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<FungibleTokenMetadataViews.FTView>():
                return FungibleTokenMetadataViews.FTView(
                    ftDisplay: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                    ftVaultData: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                )
            case Type<FungibleTokenMetadataViews.FTDisplay>():
                let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                        url: "INSERT LOGO"
                    ),
                    mediaType: "image"
                )
                let bannerMedia = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                        url: "INSERT BANNER LOGO"
                    ),
                    mediaType: "image"
                )
                let medias = MetadataViews.Medias([media, bannerMedia])
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
                    storagePath: ExampleToken.VaultStoragePath,
                    receiverPath: ExampleToken.ReceiverPublicPath,
                    metadataPath: ExampleToken.VaultPublicPath,
                    receiverLinkedType: Type<&Vault>(),
                    metadataLinkedType: Type<&Vault>(),
                    createEmptyVaultFunction: (fun(): @{FungibleToken.Vault} {
                        return <-ExampleToken.createEmptyVault(vaultType: Type<@Vault>())
                    })
                )
            case Type<FungibleTokenMetadataViews.TotalSupply>():
                return FungibleTokenMetadataViews.TotalSupply(
                    totalSupply: ExampleToken.totalSupply
                )
        }
        return nil
    }

    init(
      _paymentTokenInfo: ToucansTokens.TokenInfo,
      _editDelay: UFix64,
      _minting: Bool,
      _initialTreasurySupply: UFix64,
      _maxSupply: UFix64?,
      _extra: {String: AnyStruct}
    ) {

      // Contract Variables
      self.totalSupply = 0.0
      self.maxSupply = _maxSupply

      // Paths
      self.VaultStoragePath = /storage/ExampleTokenVault
      self.ReceiverPublicPath = /public/ExampleTokenReceiver
      self.VaultPublicPath = /public/ExampleTokenMetadata
      self.MinterStoragePath = /storage/ExampleTokenMinter
      self.AdministratorStoragePath = /storage/ExampleTokenAdmin
 
      // Admin Setup
      let vault <- create Vault(balance: self.totalSupply)
      self.account.storage.save(<- vault, to: self.VaultStoragePath)

      let publicCap = self.account.capabilities.storage.issue<&Vault>(self.VaultStoragePath)
      self.account.capabilities.publish(publicCap, at: self.VaultPublicPath)

      let receiverCap = self.account.capabilities.storage.issue<&Vault>(self.VaultStoragePath)
      self.account.capabilities.publish(receiverCap, at: self.ReceiverPublicPath)

      if self.account.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
        self.account.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
        let cap = self.account.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
        self.account.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
      }

      let toucansProjectCollection = self.account.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)!
      toucansProjectCollection.createProject(
        projectTokenInfo: ToucansTokens.TokenInfo("ExampleToken", self.account.address, "INSERT SYMBOL", self.ReceiverPublicPath, self.VaultPublicPath, self.VaultStoragePath), 
        paymentTokenInfo: _paymentTokenInfo, 
        minter: <- create Minter(), 
        editDelay: _editDelay,
        minting: _minting,
        initialTreasurySupply: _initialTreasurySupply,
        extra: _extra
      )

      self.account.storage.save(<- create Administrator(), to: self.AdministratorStoragePath)
    }
}
 