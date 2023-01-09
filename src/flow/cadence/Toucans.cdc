import FungibleToken from "./utility/FungibleToken.cdc"
import FUSD from "./utility/FUSD.cdc"
import FlowToken from "./utility/FlowToken.cdc" 

pub contract Toucans {

  pub event NewFundingCycle(
    projectId: UInt64, 
    projectOwner: Address, 
    currentCycle: UInt64,
    fundingTarget: UFix64?,
    issuanceRates: {Type: UFix64},
    reserveRate: UFix64,
    amountPurchasedInRound: UFix64,
    timeFrame: CycleTimeFrame?,
    funders: {Address: {Type: UFix64}},
    amountRaised: {Type: UFix64},
    purchaseHistory: [PurchaseData]
  )

  pub struct PurchaseData {
    pub let amount: UFix64
    pub let buyer: Address
    pub let tokenType: Type
    pub let timestamp: UFix64
    pub let volumesAfter: {Type: UFix64}

    init(_ amount: UFix64, _ buyer: Address, _ tokenType: Type, _ volumesAfter: {Type: UFix64}) {
      self.amount = amount
      self.buyer = buyer
      self.tokenType = tokenType
      self.timestamp = getCurrentBlock().timestamp
      self.volumesAfter = volumesAfter
    }
  }

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
    pub let currentCycle: UInt64
    // nil if the funding target is infinity
    pub let fundingTarget: UFix64?
    pub let issuanceRates: {Type: UFix64}
    // a tax on purchases
    pub let reserveRate: UFix64
    pub var amountPurchasedInRound: UFix64
    pub let timeFrame: CycleTimeFrame?
    pub let funders: {Address: {Type: UFix64}}
    pub let amountRaised: {Type: UFix64}
    pub let purchaseHistory: [PurchaseData]
    pub var extra: {String: AnyStruct}

    pub fun trackPurchase(amount: UFix64, amountPaidOfTokenType: UFix64, tokenType: Type, payer: Address) {
      self.amountPurchasedInRound = self.amountPurchasedInRound + amount
      if let funderHistory: &{Type: UFix64} = &self.funders[payer] as &{Type: UFix64}? {
        if funderHistory[tokenType] != nil {
          funderHistory[tokenType] = funderHistory[tokenType]! + amountPaidOfTokenType
        } else {
          funderHistory[tokenType] = amountPaidOfTokenType
        }
      } else {
        self.funders[payer] = {tokenType: amountPaidOfTokenType}
      }

      self.amountRaised[tokenType] = (self.amountRaised[tokenType] ?? 0.0) + amountPaidOfTokenType
      self.purchaseHistory.append(PurchaseData(amount, payer, tokenType, self.amountRaised))
    }

    init(_currentCycle: UInt64, _fundingTarget: UFix64?, _issuanceRates: {Type: UFix64}, _reserveRate: UFix64, _timeFrame: CycleTimeFrame?, _ extra: {String: String}) {
      pre {
        _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.currentCycle = _currentCycle
      self.issuanceRates = _issuanceRates
      self.fundingTarget = _fundingTarget
      self.reserveRate = _reserveRate
      self.amountPurchasedInRound = 0.0
      self.timeFrame = _timeFrame
      self.funders = {}
      self.amountRaised = {}
      self.purchaseHistory = []
      self.extra = extra
    }
  }

  pub resource interface ProjectPublic {
    pub let tokenType: Type
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    pub var extra: {String: AnyStruct}

    pub fun getCurrentIssuanceRates(): {Type: UFix64}
    pub fun getCurrentFundingCycle(): FundingCycle
    pub fun getFundingCycles(): [FundingCycle]
  }

  pub resource Project: ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    access(self) var fundingCycles: [FundingCycle]
    access(self) let vaults: @{Type: FungibleToken.Vault}
    access(self) let userStorages: @{Address: FungibleToken.Vault}
    pub var extra: {String: AnyStruct}

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    // If this is the case, the project owner must continue to pass in 
    // projectTokens so users can receive them immediately when purchasing.
    pub fun nextFundingCycle(fundingTarget: UFix64?, issuanceRates: {Type: UFix64}, reserveRate: UFix64, timeFrame: CycleTimeFrame?, extra: {String: String}) {
      for acceptedToken in issuanceRates.keys {
        assert(self.vaults[acceptedToken] != nil, message: "You do not have a vault set up to receive this payment.")
      }

      self.currentFundingCycle = self.currentFundingCycle + 1
      let newFundingCycle: FundingCycle = FundingCycle(
        _currentCycle: self.currentFundingCycle,
        _fundingTarget: fundingTarget,
        _issuanceRates: issuanceRates,
        _reserveRate: reserveRate,
        _timeFrame: timeFrame,
        extra
      )

      self.fundingCycles.append(newFundingCycle)

      emit NewFundingCycle(
        projectId: self.projectId, 
        projectOwner: self.owner!.address, 
        currentCycle: self.currentFundingCycle,
        fundingTarget: newFundingCycle.fundingTarget,
        issuanceRates: newFundingCycle.issuanceRates,
        reserveRate: newFundingCycle.reserveRate,
        amountPurchasedInRound: newFundingCycle.amountPurchasedInRound,
        timeFrame: newFundingCycle.timeFrame,
        funders: newFundingCycle.funders,
        amountRaised: newFundingCycle.amountRaised,
        purchaseHistory: newFundingCycle.purchaseHistory
      )
    }

    // mintedTokens comes from the wrapper `Owner` resource
    // present in every Toucans token contract.
    // Sheesh, you are so smart Jacob.
    pub fun purchase(mintedTokens: @FungibleToken.Vault, paymentTokens: @FungibleToken.Vault, recipient: Address) {
      pre {
        mintedTokens.getType() == self.tokenType: "Minted tokens type does not match expected token type."
      }
      let currentFundingCycle: FundingCycle = self.getCurrentFundingCycle()
      let currentTime: UFix64 = getCurrentBlock().timestamp
      // Assert that if there is a time frame on the cycle, we are within it
      assert(
        currentFundingCycle.timeFrame == nil || (currentFundingCycle.timeFrame!.startTime <= currentTime && currentFundingCycle.timeFrame!.endTime >= currentTime),
        message: "The current funding cycle has either not begun or has ended. The project owner must start a new one to further continue funding."
      )

      let issuanceRate: UFix64 = self.getCurrentIssuanceRates()[paymentTokens.getType()] ?? panic("This token payment is not supported during this funding cycle.")
      let amount: UFix64 = issuanceRate * paymentTokens.balance
      
      let fundingCycleRef: &FundingCycle = self.getCurrentFundingCycleRef()
      fundingCycleRef.trackPurchase(amount: amount, amountPaidOfTokenType: paymentTokens.balance, tokenType: paymentTokens.getType(), payer: recipient)

      self.vaults[paymentTokens.getType()]?.deposit!(from: <- paymentTokens)

      // Assert we have not raised more than the target
      assert(
        currentFundingCycle.fundingTarget == nil || (amount + currentFundingCycle.amountPurchasedInRound <= currentFundingCycle.fundingTarget!),
        message: "You cannot purchase more than the reserve limit."
      )
      assert(amount == mintedTokens.balance, message: "Not enough tokens were minted.")

      // Tokens were purchased, so increment amount raised
      self.totalBought = self.totalBought + amount
      
      // Tax the purchased tokens with reserve rate
      let tax <- mintedTokens.withdraw(amount: mintedTokens.balance * currentFundingCycle.reserveRate)
      if let ownerStorage: &FungibleToken.Vault = &self.userStorages[self.owner!.address] as &FungibleToken.Vault? {
        ownerStorage.deposit(from: <- tax)
      } else {
        self.userStorages[self.owner!.address] <-! tax
      }

      // Return the rest after tax
      if let userStorage: &FungibleToken.Vault = &self.userStorages[recipient] as &FungibleToken.Vault? {
        userStorage.deposit(from: <- mintedTokens)
      } else {
        self.userStorages[recipient] <-! mintedTokens
      }
    }

    // Helper Functions

    pub fun getCurrentIssuanceRates(): {Type: UFix64} {
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

    init(tokenType: Type) {
      self.projectId = self.uuid
      self.vaults <- {
        Type<@FUSD.Vault>(): <- FUSD.createEmptyVault(),
        Type<@FlowToken.Vault>(): <- FlowToken.createEmptyVault()
      }
      self.currentFundingCycle = 0
      self.fundingCycles = []
      self.tokenType = tokenType
      self.totalBought = 0.0
      self.userStorages <- {}
      self.extra = {}
    }

    destroy() {
      destroy self.vaults
      destroy self.userStorages
    }
  }

  pub fun createProject(tokenType: Type): @Project {
    return <- create Project(tokenType: tokenType)
  }

}