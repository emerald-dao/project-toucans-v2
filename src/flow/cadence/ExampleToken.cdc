import FungibleToken from "./utility/FungibleToken.cdc"
import FungibleTokenMetadataViews from "./utility/FungibleTokenMetadataViews.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
// Token Types
import FlowToken from "./utility/FlowToken.cdc"
import FUSD from "./utility/FUSD.cdc"
 
pub contract ExampleToken: FungibleToken {

    // Contract Variables
    pub var totalSupply: UFix64
    pub var currentFundingCycle: UInt32
    access(self) var fundingCycle: FundingCycle

    // Paths
    pub let VaultStoragePath: StoragePath
    pub let ReceiverPublicPath: PublicPath
    pub let VaultPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    // Events
    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)
    pub event TokensMinted(amount: UFix64)
    pub event TokensBurned(amount: UFix64)
    pub event NewFundingCycle(cycle: UInt32, info: FundingCycle)

    pub struct FundingCycle {
      pub let currentCycle: UInt32
      pub let issuanceRates: IssuanceRates
      // The totalSupply of this token at the
      // time this struct is created.
      pub let initialTotalSupply: UFix64
      // Represented as a percent
      pub let reserveTokens: UFix64
      pub var amountPurchased: UFix64

      pub fun updateAmountPurchased(amount: UFix64) {
        self.amountPurchased = self.amountPurchased + amount
      }

      init(_issuanceRates: IssuanceRates, _reserveTokens: UFix64) {
        pre {
          _reserveTokens <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
        }
        self.currentCycle = ExampleToken.currentFundingCycle
        self.issuanceRates = _issuanceRates
        self.initialTotalSupply = ExampleToken.totalSupply
        self.reserveTokens = _reserveTokens
        self.amountPurchased = 0.0
      }
    }

    pub struct IssuanceRates {
      pub let FLOW: UFix64?
      pub let FUSD: UFix64?
      pub let others: {String: UFix64}

      init(_FLOW: UFix64?, _FUSD: UFix64?, _others: {String: UFix64}) {
        self.FLOW = _FLOW
        self.FUSD = _FUSD
        self.others = _others
      }
    }

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

        init(balance: UFix64) {
            self.balance = balance
        }

        destroy() {
            ExampleToken.totalSupply = ExampleToken.totalSupply - self.balance
            emit TokensBurned(amount: self.balance)
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
                        storagePath: ExampleToken.VaultStoragePath,
                        receiverPath: ExampleToken.ReceiverPublicPath,
                        metadataPath: ExampleToken.VaultPublicPath,
                        providerPath: /private/ExampleTokenVault,
                        receiverLinkedType: Type<&Vault{FungibleToken.Receiver}>(),
                        metadataLinkedType: Type<&Vault{FungibleToken.Balance, MetadataViews.Resolver}>(),
                        providerLinkedType: Type<&Vault{FungibleToken.Provider}>(),
                        createEmptyVaultFunction: (fun (): @Vault {
                            return <- ExampleToken.createEmptyVault()
                        })
                    )
            }
            return nil
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Administrator {
      pub fun mintTokens(amount: UFix64): @Vault {
        pre {
          amount > 0.0: "Amount minted must be greater than zero"
        }
        ExampleToken.totalSupply = ExampleToken.totalSupply + amount
        emit TokensMinted(amount: amount)
        return <- create Vault(balance: amount)
      }

      pub fun nextFundingCycle(issuanceRates: IssuanceRates, reserveTokens: UFix64) {
        ExampleToken.currentFundingCycle = ExampleToken.currentFundingCycle + 1

        ExampleToken.fundingCycle = FundingCycle(
          _issuanceRates: issuanceRates,
          _reserveTokens: reserveTokens
        )

        emit NewFundingCycle(cycle: ExampleToken.currentFundingCycle, info: ExampleToken.fundingCycle)
      }
    }

    pub fun purchase(amount: UFix64, tokens: @FungibleToken.Vault): @Vault {
      // Pre-condition logic (case where RR is present)
      // Given: Initial Total Supply = 100, RR = 10%
      // Explanation: Have to keep (ITS x RR = 10). Every time we mint, 
      // we must check (Amount Purchased + `amount`) isn't greater than (ITS - ITS x RR = 90)
      //
      // x + y <= z - z*w == z(1 - w)
      pre {
        (amount + self.getCurrentFundingCycle().amountPurchased) <= 
        self.getCurrentFundingCycle().initialTotalSupply * (1.0 - self.getCurrentFundingCycle().reserveTokens): 
          "You cannot purchase more than the reserve limit."
      }
      
      var issuanceRate: UFix64? = nil
      if tokens.isInstance(Type<@FlowToken.Vault>()) {
        // Get issuance rate for $FLOW
        issuanceRate = self.getCurrentIssuanceRates().FLOW ?? panic("There was no issuance rate for $FLOW.")

        let flowVault = self.account.getCapability(/public/flowTokenReceiver)
                          .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()!
        flowVault.deposit(from: <- tokens)
      } else if tokens.isInstance(Type<@FlowToken.Vault>()) {
        // Get issuance rate for $FUSD
        issuanceRate = self.getCurrentIssuanceRates().FUSD ?? panic("There was no issuance rate for $FUSD.")
        
        // Mint amount of tokens according to issuance rate
        let fusdVault = self.account.getCapability(/public/fusdReceiver)
                          .borrow<&FUSD.Vault{FungibleToken.Receiver}>()!
        fusdVault.deposit(from: <- tokens)
      } else {
        panic("There was no issuance rate for the supplied token type.")
      }

      // Mint amount of tokens according to issuance rate
      let purchasedTokens: @Vault <- create Vault(balance: amount * issuanceRate!)
      
      let fundingCycleRef: &FundingCycle = &self.fundingCycle as &FundingCycle
      fundingCycleRef.updateAmountPurchased(amount: amount)
      
      return <- purchasedTokens
    }

    // Helper Functions
    pub fun getCurrentIssuanceRates(): IssuanceRates {
      return self.fundingCycle.issuanceRates
    }

    pub fun getCurrentFundingCycle(): FundingCycle {
      return self.fundingCycle
    }

    init(
      _totalSupply: UFix64, 
      _initialFUSDIssuanceRate: UFix64,
      _reserveTokens: UFix64
    ) {

      // Contract Variables
      self.totalSupply = _totalSupply
      self.currentFundingCycle = 0
      self.fundingCycle = FundingCycle(
        _issuanceRates: IssuanceRates(_FLOW: nil, _FUSD: _initialFUSDIssuanceRate, _others: {}),
        _reserveTokens: _reserveTokens
      )

      // Paths
      self.VaultStoragePath = /storage/ExampleTokenVault
      self.ReceiverPublicPath = /public/ExampleTokenReceiver
      self.VaultPublicPath = /public/ExampleTokenMetadata
      self.AdminStoragePath = /storage/ExampleTokenAdmin

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

      let admin <- create Administrator()
      self.account.save(<-admin, to: self.AdminStoragePath)

      // Events
      emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
 