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

  pub event ProjectCreated(
    projectId: UInt64,
    tokenType: Type,
    by: Address
  )

  pub event NewFundingCycle(
    projectId: UInt64, 
    tokenType: Type,
    by: Address, 
    currentCycle: UInt64?,
    cycleNum: UInt64,
    fundingTarget: UFix64?,
    issuanceRate: UFix64,
    reserveRate: UFix64,
    timeframe: CycleTimeFrame?
  )

  pub event Purchase(
    projectId: UInt64, 
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64,
    amount: UFix64,
    by: Address,
    message: String
  )

  pub event Distribute(
    projectId: UInt64, 
    tokenType: Type,
    by: Address, 
    currentCycle: UInt64?,
    amounts: {Address: UFix64}
  )

  pub event Donate(
    projectId: UInt64, 
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    by: Address
  )

  pub event Withdraw(
    projectId: UInt64, 
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    by: Address
  )

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
    pub let timeframe: CycleTimeFrame
    pub let payouts: [Payout]
    pub var extra: {String: AnyStruct}

    init(_cycleNum: UInt64, _fundingTarget: UFix64?, _issuanceRate: UFix64, _reserveRate: UFix64, _timeframe: CycleTimeFrame, _payouts: [Payout], _ extra: {String: String}) {
      pre {
        _reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.cycleNum = _cycleNum
      self.issuanceRate = _issuanceRate
      self.fundingTarget = _fundingTarget
      self.reserveRate = _reserveRate
      self.timeframe = _timeframe
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

    pub fun trackPurchase(amount: UFix64, amountOfFlow: UFix64, payer: Address) {
      self.numOfTokensPurchased = self.numOfTokensPurchased + amount
      self.funders[payer] = (self.funders[payer] ?? 0.0) + amountOfFlow
      self.numOfFlowContributed = self.numOfFlowContributed + amountOfFlow
    }

    init(_details: FundingCycleDetails) {
      self.details = _details
      self.numOfTokensPurchased = 0.0
      self.funders = {}
      self.numOfFlowContributed = 0.0
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var totalFunding: UFix64
    pub let editDelay: UFix64

    // Setters
    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address)
    pub fun purchase(paymentTokens: @FlowToken.Vault, payerTokenVault: &{FungibleToken.Receiver}, message: String)
    
    // Getters
    pub fun getCurrentIssuanceRate(): UFix64?
    pub fun getCurrentFundingCycle(): FundingCycle?
    pub fun getCurrentFundingCycleNum(): UInt64?
    pub fun getMostRecentCycle(): Int
    pub fun getFundingCycles(): [FundingCycle]
    pub fun getVaultTypesInTreasury(): [Type]
    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64?
    pub fun getExtra(): {String: AnyStruct}
    pub fun getFunders(): {Address: UFix64}
  }

  pub resource Project: ProjectPublic {
    pub let projectId: UInt64
    pub let tokenType: Type
    pub var totalFunding: UFix64
    pub let editDelay: UFix64

    access(self) var fundingCycles: [FundingCycle]
    access(self) let treasury: @{Type: FungibleToken.Vault}
    access(self) let minter: @{Minter}
    access(self) let funders: {Address: UFix64}
    access(self) var extra: {String: AnyStruct}

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    pub fun configureFundingCycle(fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeframe: CycleTimeFrame, payouts: [Payout], extra: {String: String}) {
      let cycleNum = UInt64(self.fundingCycles.length)

      if cycleNum >= 1 {
        let previousCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        assert(
          timeframe.startTime > previousCycle.details.timeframe.startTime,
          message: "The new cycle must have a start time greater than the one before it."
        )
        assert(
          previousCycle.details.timeframe.endTime == nil || (timeframe.startTime >= previousCycle.details.timeframe.endTime!),
          message: "If the previous cycle's end time is set, the new cycle must have a start time >= the previous rounds end time."
        )
      }

      let details = FundingCycleDetails(
        _cycleNum: cycleNum,
        _fundingTarget: fundingTarget,
        _issuanceRate: issuanceRate,
        _reserveRate: reserveRate,
        _timeframe: timeframe,
        _payouts: payouts,
        extra
      )
      let newFundingCycle: FundingCycle = FundingCycle(_details: details)

      self.fundingCycles.append(newFundingCycle)

      emit NewFundingCycle(
        projectId: self.projectId, 
        tokenType: self.tokenType,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        cycleNum: cycleNum,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        timeframe: timeframe
      )
    }

    pub fun editUpcomingCycle(cycleNum: UInt64, details: FundingCycleDetails) {
      assert(
        Int(cycleNum) > self.getMostRecentCycle(),
        message: "You can only edit cycles that have not happened yet."
      )
      let fundingCycle: &FundingCycle = self.getFundingCycleRef(cycleNum: cycleNum)
      assert(
        getCurrentBlock().timestamp + self.editDelay <= fundingCycle.details.timeframe.startTime,
        message: "You are no longer allowed to edit this upcoming cycle because of your edit delay." 
      )

      // Check the cycle above it, if it exists
      if Int(cycleNum) < self.fundingCycles.length - 1 {
        let aboveCycle = self.getFundingCycle(cycleNum: cycleNum + 1)
        assert(
          details.timeframe.startTime < aboveCycle.details.timeframe.startTime,
          message: "New start time must be less than the one after it."
        )
        assert(
          details.timeframe.endTime == nil || (details.timeframe.endTime! < aboveCycle.details.timeframe.startTime),
          message: "New end time must be nil or less than the starting time of the cycle after it."
        )
      }

      // Check the cycle below it, if it exists
      if cycleNum > 0 {
        let belowCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        assert(
          belowCycle.details.timeframe.endTime == nil || details.timeframe.startTime > belowCycle.details.timeframe.endTime!,
          message: "New start time must be greater than the end time of the cycle before it."
        )
        assert(
          belowCycle.details.timeframe.startTime < details.timeframe.startTime,
          message: "New start time must be greater than the start time of the cycle before it."
        )
      }

      fundingCycle.details = details
    }

    // mintedTokens comes from the wrapper `Owner` resource
    // present in every Toucans token contract.
    // Sheesh, you are so smart Jacob.
    pub fun purchase(paymentTokens: @FlowToken.Vault, payerTokenVault: &{FungibleToken.Receiver}, message: String) {
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
      self.totalFunding = self.totalFunding + amountOfFlowSent
      self.funders[payer] = (self.funders[payer] ?? 0.0) + amount
      emit Purchase(
        projectId: self.projectId, 
        tokenType: self.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum()!,
        amount: amountOfFlowSent,
        by: payer,
        message: message
      )
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
      emit Donate(
        projectId: self.projectId, 
        tokenType: self.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        amount: vault.balance,
        by: payer
      )
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    pub fun withdrawFromTreasury(vault: &{FungibleToken.Receiver}, amount: UFix64) {
      emit Withdraw(
        projectId: self.projectId, 
        tokenType: self.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        amount: amount,
        by: vault.owner!.address
      )
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
        if currentTime >= cycle.details.timeframe.startTime {
          if (cycle.details.timeframe.endTime == nil || currentTime <= cycle.details.timeframe.endTime!){
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
        if currentTime >= cycle.details.timeframe.startTime {
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
      self.totalFunding = 0.0
      self.extra = {}
      let testMint: @FungibleToken.Vault <- minter.mint(amount: 0.0)
      self.tokenType = testMint.getType()
      self.treasury <- {testMint.getType(): <- testMint}
      self.minter <- minter
      self.funders = {}
      self.editDelay = editDelay
    }

    destroy() {
      destroy self.treasury
      destroy self.minter
    }
  }

  pub resource interface CollectionPublic {
    pub fun getProjectIds(): [UInt64]
    pub fun borrowProjectPublic(projectId: UInt64): &Project{ProjectPublic}?
  }

  pub resource Collection: CollectionPublic {
    pub let projects: @{UInt64: Project}

    pub fun createProject(
      minter: @{Minter},
      fundingTarget: UFix64?, 
      issuanceRate: UFix64, 
      reserveRate: UFix64, 
      timeframe: CycleTimeFrame, 
      payouts: [Payout], 
      editDelay: UFix64,
      extra: {String: String}
    ) {
      let project <- create Project(minter: <- minter, editDelay: editDelay)
      let projectId: UInt64 = project.uuid
      self.projects[projectId] <-! project
      // we have to do it this weird way because of `self.owner!.address` in `configureFundingCycle`
      let ref = self.borrowProject(projectId: projectId)!
      ref.configureFundingCycle(fundingTarget: fundingTarget, issuanceRate: issuanceRate, reserveRate: reserveRate, timeframe: timeframe, payouts: payouts, extra: extra)
      emit ProjectCreated(
        projectId: projectId,
        tokenType: ref.tokenType,
        by: self.owner!.address
      )
    }

    pub fun borrowProject(projectId: UInt64): &Project? {
      return &self.projects[projectId] as &Project?
    }

    pub fun getProjectIds(): [UInt64] {
      return self.projects.keys
    }

    pub fun borrowProjectPublic(projectId: UInt64): &Project{ProjectPublic}? {
      return &self.projects[projectId] as &Project{ProjectPublic}?
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
 