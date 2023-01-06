import FungibleToken from "./utility/FungibleToken.cdc"
import FungibleTokenMetadataViews from "./utility/FungibleTokenMetadataViews.cdc"
import MetadataViews from "./utility/MetadataViews.cdc"
// Token Types
import FlowToken from "./utility/FlowToken.cdc"
import FUSD from "./utility/FUSD.cdc"
 
pub contract ExampleFinancial: FungibleToken {

    // The total amount that have been sold off so far
    pub var amountBought: UFix64
    // The amount of tokens in existance
    pub var totalSupply: UFix64
    pub var currentFundingCycle: UInt32
    access(self) var fundingCycles: [FundingCycle]

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

    pub struct CycleTimeFrame {
      pub let startTime: UFix64
      pub let endTime: UFix64

      init(_ startTime: UFix64, _ endTime: UFix64) {
        pre {
          endTime > startTime: "The end time must be greater than the start time."
        }
        self.startTime = startTime
        self.endTime = endTime
      }
    }

    pub struct FundingCycle {
      pub let currentCycle: UInt32
      // nil if the funding target is infinity
      pub let fundingTarget: UFix64?
      pub let issuanceRates: IssuanceRates
      // a tax on purchases
      pub let reserveRate: UFix64
      pub var amountPurchasedInRound: UFix64
      pub let timeFrame: CycleTimeFrame?

      pub fun updateAmountPurchased(amount: UFix64) {
        self.amountPurchasedInRound = self.amountPurchasedInRound + amount
      }

      init(_fundingTarget: UFix64?, _issuanceRates: IssuanceRates, _reserveRate: UFix64, _timeFrame: CycleTimeFrame?) {
        pre {
          _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
        }
        self.currentCycle = ExampleFinancial.currentFundingCycle
        self.issuanceRates = _issuanceRates
        self.fundingTarget = _fundingTarget
        self.reserveRate = _reserveRate
        self.amountPurchasedInRound = 0.0
        self.timeFrame = _timeFrame
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

    pub resource Administrator {
      // INSERT MINTING HERE

      pub fun nextFundingCycle(fundingTarget: UFix64?, issuanceRates: IssuanceRates, reserveRate: UFix64, timeFrame: CycleTimeFrame?) {
        ExampleFinancial.currentFundingCycle = ExampleFinancial.currentFundingCycle + 1
        let newFundingCycle = FundingCycle(
          _fundingTarget: fundingTarget,
          _issuanceRates: issuanceRates,
          _reserveRate: reserveRate,
          _timeFrame: timeFrame
        )

        ExampleFinancial.fundingCycles.append(newFundingCycle)

        emit NewFundingCycle(cycle: ExampleFinancial.currentFundingCycle, info: newFundingCycle)
      }
    }

    pub fun purchase(amount: UFix64, tokens: @FungibleToken.Vault): @Vault {
      let currentFundingCycle: ExampleFinancial.FundingCycle = self.getCurrentFundingCycle()
      // Assert we have not raised more than the target
      assert(
        currentFundingCycle.fundingTarget == nil || (amount + currentFundingCycle.amountPurchasedInRound <= currentFundingCycle.fundingTarget!),
        message: "You cannot purchase more than the reserve limit."
      )
      let currentTime: UFix64 = getCurrentBlock().timestamp
      // Assert that if there is a time frame on the cycle, we are within it
      assert(
        currentFundingCycle.timeFrame == nil || (currentFundingCycle.timeFrame!.startTime <= currentTime && currentFundingCycle.timeFrame!.endTime >= currentTime),
        message: "The current funding cycle has ended. The project owner must start a new one to further continue funding."
      )
      
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
      
      let fundingCycleRef: &FundingCycle = self.getCurrentFundingCycleRef()
      fundingCycleRef.updateAmountPurchased(amount: amount)

      // Tokens were minted, so increase supply
      self.totalSupply = self.totalSupply + amount
      // Tokens were purchased, so increment amount raised
      self.amountBought = self.amountBought + amount
      
      // Tax the purchased tokens with reserve rate
      let tax: @Vault <- purchasedTokens.withdraw(amount: purchasedTokens.balance * currentFundingCycle.reserveRate) as! @ExampleFinancial.Vault
      let vault = self.account.getCapability(self.ReceiverPublicPath)
                .borrow<&Vault{FungibleToken.Receiver}>()!
      vault.deposit(from: <- tax)

      // Return the rest after tax
      return <- purchasedTokens
    }

    // Helper Functions

    pub fun getCurrentIssuanceRates(): IssuanceRates {
      return self.getCurrentFundingCycle().issuanceRates
    }

    pub fun getCurrentFundingCycle(): FundingCycle {
      return self.fundingCycles[self.currentFundingCycle]
    }

    access(self) fun getCurrentFundingCycleRef(): &FundingCycle {
      return &self.fundingCycles[self.currentFundingCycle] as &FundingCycle
    }

    pub fun getFundingCycles(): [FundingCycle] {
      return self.fundingCycles
    }

    init(
      _fundingTarget: UFix64,
      _initialFUSDIssuanceRate: UFix64,
      _reserveRate: UFix64,
      _timeFrame: CycleTimeFrame?
    ) {

      // Contract Variables
      self.totalSupply = 0.0
      self.amountBought = 0.0
      self.currentFundingCycle = 0
      self.fundingCycles = [FundingCycle(
        _fundingTarget: _fundingTarget,
        _issuanceRates: IssuanceRates(_FLOW: nil, _FUSD: _initialFUSDIssuanceRate, _others: {}),
        _reserveRate: _reserveRate,
        _timeFrame: _timeFrame
      )]

      // Paths
      self.VaultStoragePath = /storage/ExampleFinancialVault
      self.ReceiverPublicPath = /public/ExampleFinancialReceiver
      self.VaultPublicPath = /public/ExampleFinancialMetadata
      self.AdminStoragePath = /storage/ExampleFinancialAdmin

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
 