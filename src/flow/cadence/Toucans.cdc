import FungibleToken from "./utility/FungibleToken.cdc"
import FUSD from "./utility/FUSD.cdc"
import FlowToken from "./utility/FlowToken.cdc" 

pub contract Toucans {

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  pub resource interface Minter {
    pub fun mint(amount: UFix64): @FungibleToken.Vault {
      post {
        result.balance == amount: "Did not mint correct number of tokens."
      }
    }
  }

  pub event NewFundingCycle(
    projectId: UInt64, 
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64,
    fundingTarget: UFix64?,
    issuanceRate: UFix64,
    reserveRate: UFix64,
    numOfTokensPurchased: UFix64,
    timeFrame: CycleTimeFrame?,
    funders: {Address: UFix64},
    numOfFlowContributed: UFix64,
    purchaseHistory: [Purchase]
  )

  pub struct interface Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
  }

  pub struct Purchase: Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
    pub let amount: UFix64
    pub let buyer: Address

    init(_ fundingCycle: UInt64?, _ amount: UFix64, _ buyer: Address) {
      self.type = "Purchase"
      self.timestamp = getCurrentBlock().timestamp
      self.fundingCycle = fundingCycle
      self.amount = amount
      self.buyer = buyer
    }
  }

  pub struct Distribute: Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
    pub let amounts: {Address: UFix64}

    init(_ fundingCycle: UInt64?, _ amounts: {Address: UFix64}) {
      self.type = "Distribute"
      self.timestamp = getCurrentBlock().timestamp
      self.fundingCycle = fundingCycle
      self.amounts = amounts
    }
  }

  pub struct NewCycle: Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
    pub let cycleInfo: FundingCycleDetails

    init(_ fundingCycle: UInt64?, _ cycleInfo: FundingCycleDetails) {
      self.type = "NewCycle"
      self.timestamp = getCurrentBlock().timestamp
      self.fundingCycle = fundingCycle
      self.cycleInfo = cycleInfo
    }
  }

  pub struct Donate: Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
    pub let tokenType: Type
    pub let amount: UFix64
    pub let by: Address

    init(_ fundingCycle: UInt64?, _ tokenType: Type, _ amount: UFix64, _ by: Address) {
      self.type = "Donate"
      self.timestamp = getCurrentBlock().timestamp
      self.fundingCycle = fundingCycle
      self.tokenType = tokenType
      self.amount = amount
      self.by = by
    }
  }

  pub struct Withdraw: Action {
    pub let type: String
    pub let timestamp: UFix64
    pub let fundingCycle: UInt64?
    pub let tokenType: Type
    pub let amount: UFix64
    pub let to: Address

    init(_ fundingCycle: UInt64?, _ tokenType: Type, _ amount: UFix64, _ to: Address) {
      self.type = "Withdraw"
      self.timestamp = getCurrentBlock().timestamp
      self.fundingCycle = fundingCycle
      self.tokenType = tokenType
      self.amount = amount
      self.to = to
    }
  }

  pub struct CycleTimeFrame {
    pub let startTime: UFix64
    pub let endTime: UFix64?

    init(_ startTime: UFix64, _ endTime: UFix64?) {
      pre {
        endTime == nil || (endTime! > startTime): "The end time must be greater than the start time."
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

  pub struct FundingCycleDetails {
    pub let cycleNum: UInt64
    // nil if the funding target is infinity
    pub let fundingTarget: UFix64?
    pub let issuanceRate: UFix64
    // a tax on purchases
    pub let reserveRate: UFix64
    pub let timeFrame: CycleTimeFrame
    pub let payouts: [Payout]
    pub var extra: {String: AnyStruct}

    init(_cycleNum: UInt64, _fundingTarget: UFix64?, _issuanceRate: UFix64, _reserveRate: UFix64, _timeFrame: CycleTimeFrame, _payouts: [Payout], _ extra: {String: String}) {
      pre {
        _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.cycleNum = _cycleNum
      self.issuanceRate = _issuanceRate
      self.fundingTarget = _fundingTarget
      self.reserveRate = _reserveRate
      self.timeFrame = _timeFrame
      self.extra = extra
      self.payouts = _payouts.concat([Payout(address: Toucans.account.address, percent: 0.025)])

      var percentCount: UFix64 = 0.0
      for payout in self.payouts {
        percentCount = percentCount + payout.percent
      }
      assert(percentCount <= 1.0, message: "Percents cannot be more than 100%.")
    }
  }

  pub struct FundingCycle {
    pub(set) var details: FundingCycleDetails
    pub var numOfTokensPurchased: UFix64
    pub let funders: {Address: UFix64}
    pub var numOfFlowContributed: UFix64
    pub let purchaseHistory: [Purchase]

    pub fun trackPurchase(amount: UFix64, amountOfFlow: UFix64, payer: Address) {
      self.numOfTokensPurchased = self.numOfTokensPurchased + amount
      self.funders[payer] = (self.funders[payer] ?? 0.0) + amountOfFlow
      self.numOfFlowContributed = self.numOfFlowContributed + amountOfFlow
      self.purchaseHistory.append(Purchase(self.details.cycleNum, amount, payer))
    }

    init(_details: FundingCycleDetails) {
      self.details = _details
      self.numOfTokensPurchased = 0.0
      self.funders = {}
      self.numOfFlowContributed = 0.0
      self.purchaseHistory = []
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var totalBought: UFix64
    pub let editDelay: UFix64

    // Setters
    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address)
    pub fun purchase(paymentTokens: @FlowToken.Vault, payerTokenVault: &{FungibleToken.Receiver})
    
    // Getters
    pub fun getCurrentIssuanceRate(): UFix64?
    pub fun getCurrentFundingCycle(): FundingCycle?
    pub fun getCurrentFundingCycleNum(): UInt64?
    pub fun getFundingCycles(): [FundingCycle]
    pub fun getVaultTypesInTreasury(): [Type]
    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64?
    pub fun getActions(): [{Action}]
    pub fun getExtra(): {String: AnyStruct}
    pub fun getFunders(): {Address: UFix64}
  }

  pub resource Project: ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var totalBought: UFix64
    pub let editDelay: UFix64

    access(self) var fundingCycles: [FundingCycle]
    access(self) let actions: [{Action}]
    access(self) let treasury: @{Type: FungibleToken.Vault}
    access(self) let minter: @{Minter}
    access(self) let funders: {Address: UFix64}
    access(self) var extra: {String: AnyStruct}

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    // If this is the case, the project owner must continue to pass in 
    // projectTokens so users can receive them immediately when purchasing.
    pub fun configureFundingCycle(fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeFrame: CycleTimeFrame, payouts: [Payout], extra: {String: String}) {
      let cycleNum = UInt64(self.fundingCycles.length)

      if cycleNum >= 1 {
        let previousCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        assert(
          timeFrame.startTime > previousCycle.details.timeFrame.startTime,
          message: "The new cycle must have a start time greater than the one before it."
        )
        assert(
          previousCycle.details.timeFrame.endTime == nil || (timeFrame.startTime >= previousCycle.details.timeFrame.endTime!),
          message: "If the previous cycle's end time is set, the new cycle must have a start time >= the previous rounds end time."
        )
      }

      let details = FundingCycleDetails(
        _cycleNum: cycleNum,
        _fundingTarget: fundingTarget,
        _issuanceRate: issuanceRate,
        _reserveRate: reserveRate,
        _timeFrame: timeFrame,
        _payouts: payouts,
        extra
      )
      let newFundingCycle: FundingCycle = FundingCycle(_details: details)

      self.fundingCycles.append(newFundingCycle)
      self.actions.append(NewCycle(cycleNum, details))

      emit NewFundingCycle(
        projectId: self.projectId, 
        tokenType: self.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: cycleNum,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        numOfTokensPurchased: newFundingCycle.numOfTokensPurchased,
        timeFrame: timeFrame,
        funders: newFundingCycle.funders,
        numOfFlowContributed: newFundingCycle.numOfFlowContributed,
        purchaseHistory: newFundingCycle.purchaseHistory
      )
    }

    pub fun editUpcomingCycle(cycleNum: UInt64, details: FundingCycleDetails) {
      assert(
        Int(cycleNum) > self.getMostRecentCycle(),
        message: "You can only edit cycles that have not happened yet."
      )
      let fundingCycle: &FundingCycle = self.getFundingCycleRef(cycleNum: cycleNum)
      assert(
        getCurrentBlock().timestamp + self.editDelay <= fundingCycle.details.timeFrame.startTime,
        message: "You are no longer allowed to edit this upcoming cycle because of your edit delay." 
      )

      // Check the cycle above it, if it exists
      if Int(cycleNum) < self.fundingCycles.length - 1 {
        let aboveCycle = self.getFundingCycle(cycleNum: cycleNum + 1)
        assert(
          details.timeFrame.startTime < aboveCycle.details.timeFrame.startTime,
          message: "New start time must be less than the one after it."
        )
        assert(
          details.timeFrame.endTime == nil || (details.timeFrame.endTime! < aboveCycle.details.timeFrame.startTime),
          message: "New end time must be nil or less than the starting time of the cycle after it."
        )
      }

      // Check the cycle below it, if it exists
      if cycleNum > 0 {
        let belowCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        assert(
          belowCycle.details.timeFrame.endTime == nil || details.timeFrame.startTime > belowCycle.details.timeFrame.endTime!,
          message: "New start time must be greater than the end time of the cycle before it."
        )
        assert(
          belowCycle.details.timeFrame.startTime < details.timeFrame.startTime,
          message: "New start time must be greater than the start time of the cycle before it."
        )
      }

      fundingCycle.details = details
    }

    // mintedTokens comes from the wrapper `Owner` resource
    // present in every Toucans token contract.
    // Sheesh, you are so smart Jacob.
    pub fun purchase(paymentTokens: @FlowToken.Vault, payerTokenVault: &{FungibleToken.Receiver}) {
      let fundingCycleRef: &FundingCycle = self.getCurrentFundingCycleRef() ?? panic("There is no active cycle.")
      let amountOfFlowSent: UFix64 = paymentTokens.balance
      let payer: Address = payerTokenVault.owner!.address

      let issuanceRate: UFix64 = self.getCurrentIssuanceRate()!
      let amount: UFix64 = issuanceRate * amountOfFlowSent
      let mintedTokens <- self.minter.mint(amount: amount)
      assert(mintedTokens.getType() == self.tokenType, message: "Someone is messing with the minter. It's not minting the original type.")
      assert(amount == mintedTokens.balance, message: "Not enough tokens were minted.")

      // Tax the purchased tokens with reserve rate
      let tax: @FungibleToken.Vault <- mintedTokens.withdraw(amount: mintedTokens.balance * fundingCycleRef.details.reserveRate)
      // Deposit new tokens to payer
      payerTokenVault.deposit(from: <- mintedTokens)
      // Deposit tax to project treasury
      self.depositToTreasury(vault: <- tax)

      // Calculate payouts
      for payout in fundingCycleRef.details.payouts {
        Toucans.depositTokensToAccount(funds: <- paymentTokens.withdraw(amount: amountOfFlowSent * payout.percent), to: payout.address, publicPath: /public/flowTokenReceiver)
      }
      // Deposit the rest to treasury
      self.depositToTreasury(vault: <- paymentTokens)

      fundingCycleRef.trackPurchase(amount: amount, amountOfFlow: amountOfFlowSent, payer: payer)
      // Tokens were purchased, so increment amount raised
      self.totalBought = self.totalBought + amount
      self.funders[payer] = (self.funders[payer] ?? 0.0) + amount
      self.actions.append(Purchase(self.getCurrentFundingCycleNum(), amountOfFlowSent, payer))
    }

    // Helper Functions

    access(self) fun depositToTreasury(vault: @FungibleToken.Vault) {
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address) {
      self.actions.append(Donate(self.getCurrentFundingCycleNum(), vault.getType(), vault.balance, payer))
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    pub fun withdrawFromTreasury(vault: &{FungibleToken.Receiver}, amount: UFix64) {
      self.actions.append(Withdraw(self.getCurrentFundingCycleNum(), vault.getType(), amount, vault.owner!.address))
      vault.deposit(from: <- self.treasury[vault.getType()]?.withdraw!(amount: amount))
    }

    // Getters

    pub fun getVaultTypesInTreasury(): [Type] {
      return self.treasury.keys
    }

    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64? {
      return self.treasury[vaultType]?.balance
    }

    pub fun getCurrentIssuanceRate(): UFix64? {
      return self.getCurrentFundingCycle()?.details?.issuanceRate
    }

    pub fun getCurrentFundingCycle(): FundingCycle? {
      let currentTime: UFix64 = getCurrentBlock().timestamp
      var i = self.fundingCycles.length - 1

      while i >= 0 {
        let cycle = self.fundingCycles[i]
        // If at any time we're greater than the cycle we're inspecting's start
        // time, we will return something.
        if currentTime >= cycle.details.timeFrame.startTime {
          if (cycle.details.timeFrame.endTime == nil || currentTime <= cycle.details.timeFrame.endTime!){
            // In this case, we're in the middle of the latest one
            return cycle
          } else {
            // In this case, we're past the latest one
            return nil
          }
        }
        i = i - 1
      }
      return nil
    }

    pub fun getMostRecentCycle(): Int {
      let currentTime: UFix64 = getCurrentBlock().timestamp
      var i = self.fundingCycles.length - 1

      while i >= 0 {
        let cycle = self.fundingCycles[i]
        // If at any time we're greater than the cycle we're inspecting's start
        // time, we will return something.
        if currentTime >= cycle.details.timeFrame.startTime {
          return i
        }
        i = i - 1
      }
      return -1
    }

    pub fun getCurrentFundingCycleNum(): UInt64? {
      let currentCycle = self.getCurrentFundingCycle()
      return currentCycle?.details?.cycleNum
    }

    access(self) fun getCurrentFundingCycleRef(): &FundingCycle? {
      let currentCycle = self.getCurrentFundingCycle()
      if currentCycle == nil {
        return nil
      }
      return &self.fundingCycles[currentCycle!.details.cycleNum] as &FundingCycle
    }

    pub fun getFundingCycle(cycleNum: UInt64): FundingCycle {
      return self.fundingCycles[cycleNum]
    }

    access(self) fun getFundingCycleRef(cycleNum: UInt64): &FundingCycle {
      return &self.fundingCycles[cycleNum] as &FundingCycle
    }

    pub fun getFundingCycles(): [FundingCycle] {
      return self.fundingCycles
    }

    pub fun getActions(): [{Action}] {
      return self.actions
    }

    pub fun getExtra(): {String: AnyStruct} {
      return self.extra
    }

    pub fun getFunders(): {Address: UFix64} {
      return self.funders
    }

    init(
      minter: @{Minter},
      editDelay: UFix64
    ) {
      self.projectId = self.uuid
      self.fundingCycles = []
      self.totalBought = 0.0
      self.extra = {}
      let testMint: @FungibleToken.Vault <- minter.mint(amount: 0.0)
      self.tokenType = testMint.getType()
      self.treasury <- {testMint.getType(): <- testMint}
      self.minter <- minter
      self.funders = {}
      self.actions = []
      self.editDelay = editDelay
    }

    destroy() {
      destroy self.treasury
      destroy self.minter
    }
  }

  pub resource interface CollectionPublic {
    pub fun getProjectTypes(): [Type]
    pub fun borrowProjectPublic(projectType: Type): &Project{ProjectPublic}?
  }

  pub resource Collection: CollectionPublic {
    pub let projects: @{Type: Project}

    pub fun createProject(
      minter: @{Minter},
      fundingTarget: UFix64?, 
      issuanceRate: UFix64, 
      reserveRate: UFix64, 
      timeFrame: CycleTimeFrame, 
      payouts: [Payout], 
      editDelay: UFix64,
      extra: {String: String}
    ) {
      let project <- create Project(minter: <- minter, editDelay: editDelay)
      let tokenType: Type = project.tokenType
      self.projects[project.tokenType] <-! project
      // we have to do it this weird way because of `self.owner!.address` in `configureFundingCycle`
      let ref = self.borrowProject(projectType: tokenType)!
      ref.configureFundingCycle(fundingTarget: fundingTarget, issuanceRate: issuanceRate, reserveRate: reserveRate, timeFrame: timeFrame, payouts: payouts, extra: extra)
    }

    pub fun borrowProject(projectType: Type): &Project? {
      return &self.projects[projectType] as &Project?
    }

    pub fun getProjectTypes(): [Type] {
      return self.projects.keys
    }

    pub fun borrowProjectPublic(projectType: Type): &Project{ProjectPublic}? {
      return &self.projects[projectType] as &Project{ProjectPublic}?
    }

    init() {
      self.projects <- {}
    }

    destroy() {
      destroy self.projects
    }
  }

  pub fun createCollection(): @Collection {
    return <- create Collection()
  }

  pub fun depositTokensToAccount(funds: @FungibleToken.Vault, to: Address, publicPath: PublicPath) {
    let vault = getAccount(to).getCapability(publicPath).borrow<&{FungibleToken.Receiver}>() 
              ?? panic("Account does not have a proper Vault set up.")
    vault.deposit(from: <- funds)
  }

  init() {
    self.CollectionStoragePath = /storage/ToucansCollection
    self.CollectionPublicPath = /public/ToucansCollection
  }

}
 