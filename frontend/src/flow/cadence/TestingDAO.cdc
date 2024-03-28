import FungibleToken from "./utility/FungibleToken.cdc"
import FungibleTokenMetadataViews from "./utility/FungibleTokenMetadataViews.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
import Toucans from "./Toucans.cdc"
import ToucansTokens from "./ToucansTokens.cdc"
import FlowToken from "./utility/FlowToken.cdc"
 
access(all) contract TestingDAO: FungibleToken {

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
    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)
    access(all) event TokensTransferred(amount: UFix64, from: Address, to: Address)
    access(all) event TokensMinted(amount: UFix64)
    access(all) event TokensBurned(amount: UFix64)

    access(all) resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance, MetadataViews.Resolver {
        access(all) var balance: UFix64

        access(all) fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)

            if let owner: Address = self.owner?.address {
                TestingDAO.setBalance(address: owner, balance: self.balance)
            }
            return <- create Vault(balance: amount)
        }

        access(all) fun deposit(from: @FungibleToken.Vault) {
            let vault: @Vault <- from as! @Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            
            // We set the balance to 0.0 here so that it doesn't
            // decrease the totalSupply in the `destroy` function.
            vault.balance = 0.0
            destroy vault

            if let owner: Address = self.owner?.address {
                TestingDAO.setBalance(address: owner, balance: self.balance)
            }
        }

        access(all) fun getViews(): [Type]{
            return [Type<FungibleTokenMetadataViews.FTView>(),
                    Type<FungibleTokenMetadataViews.FTDisplay>(),
                    Type<FungibleTokenMetadataViews.FTVaultData>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<FungibleTokenMetadataViews.FTView>():
                    return FungibleTokenMetadataViews.FTView(
                        ftDisplay: self.resolveView(Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                        ftVaultData: self.resolveView(Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                    )
                case Type<FungibleTokenMetadataViews.FTDisplay>():
                    let media = MetadataViews.Media(
                            file: MetadataViews.HTTPFile(
                            url: "https://i.imgur.com/dsPY3ct.png"
                        ),
                        mediaType: "image"
                    )
                    let bannerMedia = MetadataViews.Media(
                            file: MetadataViews.HTTPFile(
                            url: "https://i.imgur.com/JE5HFpS.jpg"
                        ),
                        mediaType: "image"
                    )
                    let medias = MetadataViews.Medias([media, bannerMedia])
                    return FungibleTokenMetadataViews.FTDisplay(
                        name: "Testing DAO",
                        symbol: "TEST",
                        description: "An amazing Testing DAO for the people!",
                        externalURL: MetadataViews.ExternalURL("ecdao.org"),
                        logos: medias,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("emerald_dao"),
                            "discord": MetadataViews.ExternalURL("emeraldcity")
                        }
                    )
                case Type<FungibleTokenMetadataViews.FTVaultData>():
                    return FungibleTokenMetadataViews.FTVaultData(
                        storagePath: TestingDAO.VaultStoragePath,
                        receiverPath: TestingDAO.ReceiverPublicPath,
                        metadataPath: TestingDAO.VaultPublicPath,
                        providerPath: /private/TestingDAOVault,
                        receiverLinkedType: Type<&Vault{FungibleToken.Receiver}>(),
                        metadataLinkedType: Type<&Vault{FungibleToken.Balance, MetadataViews.Resolver}>(),
                        providerLinkedType: Type<&Vault{FungibleToken.Provider}>(),
                        createEmptyVaultFunction: (fun (): @Vault {
                            return <- TestingDAO.createEmptyVault()
                        })
                    )
            }
            return nil
        }
  
        init(balance: UFix64) {
            self.balance = balance
        }

        destroy() {
            emit TokensBurned(amount: self.balance)
            TestingDAO.totalSupply = TestingDAO.totalSupply - self.balance
        }
    }

    access(all) fun createEmptyVault(): @Vault {
        return <- create Vault(balance: 0.0)
    }

    access(all) resource Minter: Toucans.Minter {
        access(all) fun mint(amount: UFix64): @Vault {
            post {
                TestingDAO.maxSupply == nil || TestingDAO.totalSupply <= TestingDAO.maxSupply!: 
                    "Exceeded the max supply of tokens allowd."
            }
            TestingDAO.totalSupply = TestingDAO.totalSupply + amount
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

        access(all) fun getBalance(address: Address): UFix64 {
            return self.balances[address] ?? 0.0
        }

        access(all) fun getBalances(): {Address: UFix64} {
            return self.balances
        }

        init() {
            self.balances = {}
        }
    }

    access(contract) fun setBalance(address: Address, balance: UFix64) {
        let admin: &Administrator = self.account.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        admin.setBalance(address: address, balance: balance)
    }

    access(all) fun getBalance(address: Address): UFix64 {
        let admin: &Administrator = self.account.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        return admin.getBalance(address: address)
    }

    access(all) fun getBalances(): {Address: UFix64} {
        let admin: &Administrator = self.account.borrow<&Administrator>(from: self.AdministratorStoragePath)!
        return admin.getBalances()
    }

    init() {

      // Contract Variables
      self.totalSupply = 0.0
      self.maxSupply = nil

      // Paths
      self.VaultStoragePath = /storage/TestingDAOVault
      self.ReceiverPublicPath = /public/TestingDAOReceiver
      self.VaultPublicPath = /public/TestingDAOMetadata
      self.MinterStoragePath = /storage/TestingDAOMinter
      self.AdministratorStoragePath = /storage/TestingDAOAdmin
 
      // Admin Setup
      let vault <- create Vault(balance: self.totalSupply)
      self.account.save(<- vault, to: self.VaultStoragePath)

      self.account.link<&Vault{FungibleToken.Receiver}>(
          self.ReceiverPublicPath,
          target: self.VaultStoragePath
      )

      self.account.link<&Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
          self.VaultPublicPath,
          target: self.VaultStoragePath
      )

      if self.account.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
        self.account.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
        self.account.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
      }

      let toucansProjectCollection = self.account.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)!
      toucansProjectCollection.createProject(
        projectTokenInfo: ToucansTokens.TokenInfo("TestingDAO", self.account.address, "TEST", self.ReceiverPublicPath, self.VaultPublicPath, self.VaultStoragePath), 
        paymentTokenInfo: ToucansTokens.TokenInfo("FlowToken", 0x0ae53cb6e3f42a79, "FLOW", /public/flowTokenReceiver, /public/flowTokenBalance, /storage/flowTokenVault), 
        minter: <- create Minter(), 
        editDelay: 0.0,
        minting: true,
        initialTreasurySupply: 100.0,
        extra: {"initialAllowedNFTCollections": ["ExampleNFT"]}
      )

      self.account.save(<- create Administrator(), to: self.AdministratorStoragePath)

      // Events
      emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
 