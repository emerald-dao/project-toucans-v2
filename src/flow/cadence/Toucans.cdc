import FungibleToken from "./utility/FungibleToken.cdc"
import FUSD from "./utility/FUSD.cdc"
import FlowToken from "./utility/FlowToken.cdc" 
import ToucanRegistry from "./ToucanRegistry.cdc"
import LostToucans from "./LostToucans.cdc"

pub contract Toucans {

  pub let projects: {Type: UInt64}
  access(self) let tokens: @{Address: {Type: FungibleToken.Vault}}

  pub enum Stage: UInt8 {
    pub case NOT_STARTED
    pub case ACTIVE
    pub case SUCCESS
    pub case FAIL
  }

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
        startTime >= getCurrentBlock().timestamp: "Start time must be now or in the future."
      }
      self.startTime = startTime
      self.endTime = endTime
    }
  }

  pub struct FundingCycle {
    pub let currentCycle: UInt64
    // nil if the funding target is infinity
    pub let fundingTarget: UFix64?
    pub let threshold: UFix64?
    pub let issuanceRates: {Type: UFix64}
    // a tax on purchases
    pub let reserveRate: UFix64
    pub var amountPurchasedInRound: UFix64
    pub let timeFrame: CycleTimeFrame?
    pub let funders: {Address: {Type: UFix64}}
    pub let amountRaised: {Type: UFix64}
    pub let purchaseHistory: [PurchaseData]
    pub var stage: Stage
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

    access(contract) fun setStage(_ stage: Stage) {
      self.stage = stage
    }

    init(_currentCycle: UInt64, _fundingTarget: UFix64?, _threshold: UFix64?, _issuanceRates: {Type: UFix64}, _reserveRate: UFix64, _timeFrame: CycleTimeFrame?, _ extra: {String: String}) {
      pre {
        _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
        (_fundingTarget != nil && _threshold != nil) || (_fundingTarget == nil && _threshold == nil):
          "Funding target and threshold must both match."
      }
      self.currentCycle = _currentCycle
      self.issuanceRates = _issuanceRates
      self.fundingTarget = _fundingTarget
      self.threshold = _threshold
      self.reserveRate = _reserveRate
      self.amountPurchasedInRound = 0.0
      self.timeFrame = _timeFrame
      self.funders = {}
      self.amountRaised = {}
      self.purchaseHistory = []
      if _timeFrame == nil {
        self.stage = Stage.ACTIVE
      }
      self.stage = Stage.NOT_STARTED
      self.extra = extra
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    pub var extra: {String: AnyStruct}
    
    // Getters
    pub fun getCurrentIssuanceRates(): {Type: UFix64}
    pub fun getCurrentFundingCycle(): FundingCycle
    pub fun getFundingCycles(): [FundingCycle]
  }

  pub resource Project: ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub let publicPath: PublicPath
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    access(self) var fundingCycles: [FundingCycle]
    pub var extra: {String: AnyStruct}

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    // If this is the case, the project owner must continue to pass in 
    // projectTokens so users can receive them immediately when purchasing.
    pub fun configureFundingCycle(fundingTarget: UFix64?, threshold: UFix64?, issuanceRates: {Type: UFix64}, reserveRate: UFix64, timeFrame: CycleTimeFrame?, extra: {String: String}) {
      pre {
        Int(self.currentFundingCycle) + 1 > self.fundingCycles.length: "You cannot configure more than one funding cycle in the future."
      }

      let nextFundingCycleId: UInt64 = self.currentFundingCycle + 1

      let newFundingCycle: FundingCycle = FundingCycle(
        _currentCycle: nextFundingCycleId,
        _fundingTarget: fundingTarget,
        _threshold: threshold,
        _issuanceRates: issuanceRates,
        _reserveRate: reserveRate,
        _timeFrame: timeFrame,
        extra
      )

      self.fundingCycles.append(newFundingCycle)

      emit NewFundingCycle(
        projectId: self.projectId, 
        projectOwner: self.owner!.address, 
        currentCycle: nextFundingCycleId,
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
    pub fun purchase(mintedTokens: @FungibleToken.Vault, paymentTokens: @FungibleToken.Vault, payer: Address) {
      pre {
        mintedTokens.getType() == self.tokenType: "Minted tokens type does not match expected token type."
      }
      let fundingCycleRef: &FundingCycle = self.getCurrentFundingCycleRef()
      let currentTime: UFix64 = getCurrentBlock().timestamp
      // Assert that if there is a time frame on the cycle, we are within it
      assert(
        fundingCycleRef.timeFrame == nil || (fundingCycleRef.timeFrame!.startTime <= currentTime && fundingCycleRef.timeFrame!.endTime >= currentTime),
        message: "The current funding cycle has either not begun or has ended. The project owner must start a new one to further continue funding."
      )

      let issuanceRate: UFix64 = self.getCurrentIssuanceRates()[paymentTokens.getType()] ?? panic("This token payment is not supported during this funding cycle.")
      let amount: UFix64 = issuanceRate * paymentTokens.balance
      assert(amount == mintedTokens.balance, message: "Not enough tokens were minted.")
      
      fundingCycleRef.trackPurchase(amount: amount, amountPaidOfTokenType: paymentTokens.balance, tokenType: paymentTokens.getType(), payer: payer)
      // Tokens were purchased, so increment amount raised
      self.totalBought = self.totalBought + amount

      // Tax the purchased tokens with reserve rate
      let tax: @FungibleToken.Vault <- mintedTokens.withdraw(amount: mintedTokens.balance * fundingCycleRef.reserveRate)

      // If funding target is nil, distribute all funds now
      if fundingCycleRef.fundingTarget == nil {
        let registry: {Type: ToucanRegistry.TokenInfo} = ToucanRegistry.getRegistry()
        let tokenInfo: ToucanRegistry.TokenInfo = registry[paymentTokens.getType()] ?? panic("No info on this token when trying to claim funds.")
        // Deposit payment to owner
        Toucans.depositTokensToAccount(funds: <- paymentTokens, to: self.owner!.address, publicPath: tokenInfo.publicPath)
        // Deposit new tokens to payer
        Toucans.depositTokensToAccount(funds: <- mintedTokens, to: payer, publicPath: self.publicPath)
        // Deposit tax to owner
        Toucans.depositTokensToAccount(funds: <- tax, to: self.owner!.address, publicPath: self.publicPath)
      } else {
        // Assert we have not raised more than the target
        assert(
          amount + fundingCycleRef.amountPurchasedInRound <= fundingCycleRef.fundingTarget!,
          message: "You cannot purchase more than the reserve limit."
        )
        // Store payment to owner
        Toucans.depositTokensToToucans(vault: <- paymentTokens, to: self.owner!.address)
        // Store tax to owner
        Toucans.depositTokensToToucans(vault: <- tax, to: self.owner!.address)
        // Store new tokens to payer
        Toucans.depositTokensToToucans(vault: <- mintedTokens, to: payer)

        if fundingCycleRef.amountPurchasedInRound > fundingCycleRef.fundingTarget! {
          fundingCycleRef.setStage(Stage.SUCCESS)
        }
      }
    }

    // For PROJECT OWNER of the token
    pub fun finalizeFunds() {
      let fundingCycle = self.getCurrentFundingCycle()
      let registry: {Type: ToucanRegistry.TokenInfo} = ToucanRegistry.getRegistry()
      switch fundingCycle.stage {
        case Stage.FAIL: panic("Nothing happens.")
        // If success, project owner should claim the funds in their storage.
        case Stage.SUCCESS:
          let amountRaised: {Type: UFix64} = fundingCycle.amountRaised
          for type in amountRaised.keys {
            let amountOfType: UFix64 = amountRaised[type]!
            if let returnVault: @FungibleToken.Vault <- Toucans.withdrawTokensFromToucans(type: type, amount: amountOfType, from: self.owner!.address) {
              let tokenInfo: ToucanRegistry.TokenInfo = registry[type] ?? panic("No info on this token when trying to claim funds.")
              Toucans.depositTokensToAccount(funds: <- returnVault, to: self.owner!.address, publicPath: tokenInfo.publicPath)
            }
          }
        default: panic("You cannot finalize orders if the current funding cycle is not over.")
      }
    }

    // For PURCHASERS of the token
    pub fun finalizeOrders(for: [Address]) {
      let fundingCycle = self.getCurrentFundingCycle()
      let registry: {Type: ToucanRegistry.TokenInfo} = ToucanRegistry.getRegistry()
      switch fundingCycle.stage {
        // If fail:
        // 1. User should claim back their funds in their storage
        // 2. User should destroy the minted tokens in their storage
        case Stage.FAIL: 
          for recipient in for {
            if let amountRaisedByRecipient: {Type: UFix64} = fundingCycle.funders[recipient] {
              for type in amountRaisedByRecipient.keys {
                let amountOfType: UFix64 = amountRaisedByRecipient[type]!
                if let returnVault: @FungibleToken.Vault <- Toucans.withdrawTokensFromToucans(type: type, amount: amountOfType, from: recipient) {
                  let tokenInfo: ToucanRegistry.TokenInfo = registry[type] ?? panic("No info on this token when trying to claim funds.")
                  Toucans.depositTokensToAccount(funds: <- returnVault, to: recipient, publicPath: tokenInfo.publicPath)
                }
              }
            }

            if let returnVault: @FungibleToken.Vault <- Toucans.withdrawTokensFromToucans(type: self.tokenType, amount: nil, from: recipient) {
              destroy returnVault
            }
          }
        // If success, user should claim their funds in their storage.
        case Stage.SUCCESS:
          for recipient in for {
            if let returnVault: @FungibleToken.Vault <- Toucans.withdrawTokensFromToucans(type: self.tokenType, amount: nil, from: recipient) {
              Toucans.depositTokensToAccount(funds: <- returnVault, to: recipient, publicPath: self.publicPath)
            }
          }
        default: panic("You cannot finalize orders if the current funding cycle is not over.")
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

    init(tokenType: Type, publicPath: PublicPath) {
      pre {
        !Toucans.projects.containsKey(tokenType): "A project already exists for this token type."
      }
      self.projectId = self.uuid
      self.currentFundingCycle = 0
      self.fundingCycles = []
      self.tokenType = tokenType
      self.publicPath = publicPath
      self.totalBought = 0.0
      self.extra = {}
      Toucans.projects[tokenType] = self.projectId
    }
  }

  pub fun createProject(tokenType: Type, publicPath: PublicPath): @Project {
    return <- create Project(tokenType: tokenType, publicPath: publicPath)
  }

  pub fun depositTokensToAccount(funds: @FungibleToken.Vault, to: Address, publicPath: PublicPath) {
    if let vault = getAccount(to).getCapability(publicPath).borrow<&{FungibleToken.Receiver}>() {
      vault.deposit(from: <- funds)
    } else {
      LostToucans.depositToucans(vault: <- funds, to: to)
    }
  }

  access(contract) fun depositTokensToToucans(vault: @FungibleToken.Vault, to: Address) {
    if let userBuckets = &self.tokens[to] as &{Type: FungibleToken.Vault}? {
      if let userBucket = &userBuckets[vault.getType()] as &FungibleToken.Vault? {
        userBucket.deposit(from: <- vault)
      } else {
        userBuckets[vault.getType()] <-! vault
      }
    } else {
      self.tokens[to] <-! {vault.getType(): <- vault}
    }
  }

  // if `amount` is nil, that means "all"
  access(contract) fun withdrawTokensFromToucans(type: Type, amount: UFix64?, from: Address): @FungibleToken.Vault? {
    if let userBuckets = &self.tokens[from] as &{Type: FungibleToken.Vault}? {
      if let userBucket = &userBuckets[type] as &FungibleToken.Vault? {
        return <- userBucket.withdraw(amount: amount ?? userBucket.balance)
      }
    }
    return nil
  }

  init() {
    self.projects = {}
    self.tokens <- {}
  }

}
 