import FungibleToken from "./FungibleToken.cdc"

// Token Types
import FlowToken from "./FlowToken.cdc"
import FUSD from "./FUSD.cdc"
 
pub contract Toucans: FungibleToken {

    // Collection Information
    pub var name: String
    pub var description: String
    pub var image: String

    // Contract Variables
    pub var totalSupply: UFix64
    pub var currentFundingCycle: UInt32
    access(self) var fundingCycle: FundingCycle

    // Paths
    pub let VaultStoragePath: StoragePath
    pub let ReceiverPublicPath: PublicPath
    pub let BalancePublicPath: PublicPath
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
      pub let reserveTokens: UFix64?
      pub var amountPurchased: UFix64

      pub fun updateAmountPurchased(amount: UFix64) {
        self.amountPurchased = self.amountPurchased + amount
      }

      init(_issuanceRates: IssuanceRates, _reserveTokens: UFix64?) {
        pre {
          _reserveTokens == nil ||
          (_reserveTokens! > 0.0 && _reserveTokens! < 1.0):
          "You must provide a percent for the reserve token rate."
        }
        self.currentCycle = Toucans.currentFundingCycle
        self.issuanceRates = _issuanceRates
        self.initialTotalSupply = Toucans.totalSupply
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

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        /// The total balance of this vault
        pub var balance: UFix64

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @Toucans.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            
            // We set the balance to 0.0 here so that it doesn't
            // decrease the totalSupply in the `destroy` function.
            vault.balance = 0.0
            destroy vault
        }

        // initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        destroy() {
            Toucans.totalSupply = Toucans.totalSupply - self.balance
            emit TokensBurned(amount: self.balance)
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    // NOTE: This should be a configurable option.
    pub resource Administrator {
      pub fun mintTokens(amount: UFix64): @Vault {
        pre {
          amount > 0.0: "Amount minted must be greater than zero"
        }
        Toucans.totalSupply = Toucans.totalSupply + amount
        emit TokensMinted(amount: amount)
        return <- create Vault(balance: amount)
      }

      pub fun nextFundingCycle(issuanceRates: IssuanceRates, reserveTokens: UFix64) {
        Toucans.currentFundingCycle = Toucans.currentFundingCycle + 1

        Toucans.fundingCycle = FundingCycle(
          _issuanceRates: issuanceRates,
          _reserveTokens: reserveTokens
        )

        emit NewFundingCycle(cycle: Toucans.currentFundingCycle, info: Toucans.fundingCycle)
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
        self.getCurrentFundingCycle().reserveTokens == nil ||
        (amount + self.getCurrentFundingCycle().amountPurchased) <= 
        self.getCurrentFundingCycle().initialTotalSupply * (1.0 - self.getCurrentFundingCycle().reserveTokens!): 
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
      _name: String,
      _description: String,
      _image: String,
      _totalSupply: UFix64, 
      _initialFUSDIssuanceRate: UFix64,
      _reserveTokens: UFix64?
    ) {
      // Collection Information
      self.name = _name
      self.description = _description
      self.image = _image

      // Contract Variables
      self.totalSupply = _totalSupply
      self.fundingCycle = FundingCycle(
        _issuanceRates: IssuanceRates(_FLOW: nil, _FUSD: _initialFUSDIssuanceRate, _others: {}),
        _reserveTokens: _reserveTokens
      )
      self.currentFundingCycle = 0

      // Paths
      self.VaultStoragePath = /storage/ToucansVault
      self.ReceiverPublicPath = /public/ToucansReceiver
      self.BalancePublicPath = /public/ToucansBalance
      self.AdminStoragePath = /storage/ToucansAdmin

      // Admin Setup
      let vault <- create Vault(balance: self.totalSupply)
      self.account.save(<-vault, to: self.VaultStoragePath)

      self.account.link<&Vault{FungibleToken.Receiver}>(
          self.ReceiverPublicPath,
          target: self.VaultStoragePath
      )

      self.account.link<&Vault{FungibleToken.Balance}>(
          self.BalancePublicPath,
          target: self.VaultStoragePath
      )

      let admin <- create Administrator()
      self.account.save(<-admin, to: self.AdminStoragePath)

      // Events
      emit TokensInitialized(initialSupply: self.totalSupply)
    }
}