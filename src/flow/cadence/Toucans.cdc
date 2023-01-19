import FungibleToken from "./utility/FungibleToken.cdc"
import FUSD from "./utility/FUSD.cdc"
import FlowToken from "./utility/FlowToken.cdc" 
import ToucanRegistry from "./ToucanRegistry.cdc"

pub contract Toucans {

  pub let projects: {Type: UInt64}

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
    issuanceRate: UFix64,
    reserveRate: UFix64,
    numOfTokensPurchased: UFix64,
    timeFrame: CycleTimeFrame?,
    funders: {Address: UFix64},
    numOfFlowContributed: UFix64,
    purchaseHistory: [PurchaseData]
  )

  pub struct PurchaseData {
    pub let amount: UFix64
    pub let buyer: Address
    pub let timestamp: UFix64
    pub let volumesAfter: UFix64

    init(_ amount: UFix64, _ buyer: Address, _ volumeAfter: UFix64) {
      self.amount = amount
      self.buyer = buyer
      self.timestamp = getCurrentBlock().timestamp
      self.volumesAfter = volumeAfter
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

  pub struct Payout {
    pub let address: Address
    pub let percent: UFix64

    init(address: Address, percent: UFix64) {
      pre {
        percent > 0.0 && percent < 1.0: "percent must be a percantage."
      }
      self.address = address
      self.percent = percent
    }
  }

  pub struct FundingCycle {
    pub let currentCycle: UInt64
    // nil if the funding target is infinity
    pub let fundingTarget: UFix64?
    pub let issuanceRate: UFix64
    // a tax on purchases
    pub let reserveRate: UFix64
    pub var numOfTokensPurchased: UFix64
    pub let timeFrame: CycleTimeFrame?
    pub let funders: {Address: UFix64}
    pub var numOfFlowContributed: UFix64
    pub let purchaseHistory: [PurchaseData]
    pub var stage: Stage
    pub let payouts: {Address: UFix64}
    pub var extra: {String: AnyStruct}

    pub fun trackPurchase(amount: UFix64, amountOfFlow: UFix64, payer: Address) {
      self.numOfTokensPurchased = self.numOfTokensPurchased + amount
      self.funders[payer] = (self.funders[payer] ?? 0.0) + amountOfFlow
      self.numOfFlowContributed = self.numOfFlowContributed + amountOfFlow
      self.purchaseHistory.append(PurchaseData(amount, payer, self.numOfFlowContributed))
    }

    access(contract) fun setStage(_ stage: Stage) {
      self.stage = stage
    }

    init(_currentCycle: UInt64, _fundingTarget: UFix64?, _issuanceRate: UFix64, _reserveRate: UFix64, _timeFrame: CycleTimeFrame?, _payouts: {Address: UFix64}, _ extra: {String: String}) {
      pre {
        _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.currentCycle = _currentCycle
      self.issuanceRate = _issuanceRate
      self.fundingTarget = _fundingTarget
      self.reserveRate = _reserveRate
      self.numOfTokensPurchased = 0.0
      self.timeFrame = _timeFrame
      self.funders = {}
      self.numOfFlowContributed = 0.0
      self.purchaseHistory = []
      if _timeFrame == nil {
        self.stage = Stage.ACTIVE
      }
      self.stage = Stage.NOT_STARTED
      self.extra = extra
      _payouts.insert(key: Toucans.account.address, 0.025)
      self.payouts = _payouts

      var percentCount: UFix64 = 0.0
      for payout in self.payouts.keys {
        assert(self.payouts[payout]! > 0.0 && self.payouts[payout]! <= 0.975, message: "Payout percentage must be at least 0% and no higher than 97.5%.")
        percentCount = percentCount + self.payouts[payout]!
      }
      assert(percentCount == 1.0, message: "Percents do not add up to 100%.")
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    pub var extra: {String: AnyStruct}

    // Setters
    pub fun depositToTreasury(vault: @FungibleToken.Vault)
    
    // Getters
    pub fun getCurrentIssuanceRate(): UFix64
    pub fun getCurrentFundingCycle(): FundingCycle
    pub fun getFundingCycles(): [FundingCycle]
    pub fun getVaultTypesInTreasury(): [Type]
    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64?
  }

  pub resource Project: ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub let publicPath: PublicPath
    pub var currentFundingCycle: UInt64
    pub var totalBought: UFix64
    pub var extra: {String: AnyStruct}

    access(self) var fundingCycles: [FundingCycle]
    access(self) let treasury: @{Type: FungibleToken.Vault}

    pub fun addVaultTypeToTreasury(vault: @FungibleToken.Vault) {
      self.treasury[vault.getType()] <-! vault
    }

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    // If this is the case, the project owner must continue to pass in 
    // projectTokens so users can receive them immediately when purchasing.
    pub fun configureFundingCycle(fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeFrame: CycleTimeFrame?, payouts: {Address: UFix64}, extra: {String: String}) {
      pre {
        Int(self.currentFundingCycle) + 1 > self.fundingCycles.length: "You cannot configure more than one funding cycle in the future."
      }

      let nextFundingCycleId: UInt64 = self.currentFundingCycle + 1
      let newFundingCycle: FundingCycle = FundingCycle(
        _currentCycle: nextFundingCycleId,
        _fundingTarget: fundingTarget,
        _issuanceRate: issuanceRate,
        _reserveRate: reserveRate,
        _timeFrame: timeFrame,
        _payouts: payouts,
        extra
      )

      self.fundingCycles.append(newFundingCycle)

      emit NewFundingCycle(
        projectId: self.projectId, 
        projectOwner: self.owner!.address, 
        currentCycle: nextFundingCycleId,
        fundingTarget: newFundingCycle.fundingTarget,
        issuanceRate: newFundingCycle.issuanceRate,
        reserveRate: newFundingCycle.reserveRate,
        numOfTokensPurchased: newFundingCycle.numOfTokensPurchased,
        timeFrame: newFundingCycle.timeFrame,
        funders: newFundingCycle.funders,
        numOfFlowContributed: newFundingCycle.numOfFlowContributed,
        purchaseHistory: newFundingCycle.purchaseHistory
      )
    }

    // mintedTokens comes from the wrapper `Owner` resource
    // present in every Toucans token contract.
    // Sheesh, you are so smart Jacob.
    pub fun purchase(mintedTokens: @FungibleToken.Vault, paymentTokens: @FlowToken.Vault, payer: Address) {
      pre {
        mintedTokens.getType() == self.tokenType: "Minted tokens type does not match expected token type."
      }
      let fundingCycleRef: &FundingCycle = self.getCurrentFundingCycleRef()
      let currentTime: UFix64 = getCurrentBlock().timestamp
      let amountOfFlowSent: UFix64 = paymentTokens.balance
      // Assert that if there is a time frame on the cycle, we are within it
      assert(
        fundingCycleRef.timeFrame == nil || (fundingCycleRef.timeFrame!.startTime <= currentTime && fundingCycleRef.timeFrame!.endTime >= currentTime),
        message: "The current funding cycle has either not begun or has ended. The project owner must start a new one to further continue funding."
      )

      let issuanceRate: UFix64 = self.getCurrentIssuanceRate()
      let amount: UFix64 = issuanceRate * amountOfFlowSent
      assert(amount == mintedTokens.balance, message: "Not enough tokens were minted.")
      
      fundingCycleRef.trackPurchase(amount: amount, amountOfFlow: amountOfFlowSent, payer: payer)
      // Tokens were purchased, so increment amount raised
      self.totalBought = self.totalBought + amount

      // Tax the purchased tokens with reserve rate
      let tax: @FungibleToken.Vault <- mintedTokens.withdraw(amount: mintedTokens.balance * fundingCycleRef.reserveRate)
      // Deposit new tokens to payer
      Toucans.depositTokensToAccount(funds: <- mintedTokens, to: payer, publicPath: self.publicPath)
      // Deposit tax to project treasury
      self.depositToTreasury(vault: <- tax)

      // Calculate payouts
      for payoutAddr in fundingCycleRef.payouts.keys {
        let payoutPercent: UFix64 = fundingCycleRef.payouts[payoutAddr]!
        let payoutTokens <- paymentTokens.withdraw(amount: amountOfFlowSent * payoutPercent)
        if payoutAddr == self.owner!.address {
          self.depositToTreasury(vault: <- payoutTokens)
        } else {
          Toucans.depositTokensToAccount(funds: <- payoutTokens, to: payoutAddr, publicPath: /public/flowTokenReceiver)
        }
      }
      assert(paymentTokens.balance == 0.0, message: "Not all funds were distributed.")
      destroy paymentTokens
    }

    // Helper Functions

    pub fun depositToTreasury(vault: @FungibleToken.Vault) {
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    // Getters

    pub fun getVaultTypesInTreasury(): [Type] {
      return self.treasury.keys
    }

    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64? {
      return self.treasury[vaultType]?.balance
    }

    pub fun getCurrentIssuanceRate(): UFix64 {
      return self.getCurrentFundingCycle().issuanceRate
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
      self.treasury <- {}
      Toucans.projects[tokenType] = self.projectId
    }

    destroy() {
      destroy self.treasury
    }
  }

  pub fun createProject(tokenType: Type, publicPath: PublicPath): @Project {
    return <- create Project(tokenType: tokenType, publicPath: publicPath)
  }

  pub fun depositTokensToAccount(funds: @FungibleToken.Vault, to: Address, publicPath: PublicPath) {
    let vault = getAccount(to).getCapability(publicPath).borrow<&{FungibleToken.Receiver}>() 
              ?? panic("Account does not have a proper Vault set up.")
    vault.deposit(from: <- funds)
  }

  init() {
    self.projects = {}
  }

}
 