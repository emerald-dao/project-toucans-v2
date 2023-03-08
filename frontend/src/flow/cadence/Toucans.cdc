import FungibleToken from "./utility/FungibleToken.cdc"
import ToucansMultiSign from "./ToucansMultiSign.cdc"

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

  pub struct TokenInfo {
    pub let contractName: String
    pub let contractAddress: Address
    pub let tokenType: Type
    pub let receiverPath: PublicPath
    pub let publicPath: PublicPath
    pub let storagePath: StoragePath

    init(_ cn: String, _ ca: Address, _ rp: PublicPath, _ pp: PublicPath, _ sp: StoragePath) {
      self.contractName = cn
      self.contractAddress = ca
      let caToString: String = ca.toString()
      self.tokenType = CompositeType("A.".concat(caToString.slice(from: 2, upTo: caToString.length)).concat(".".concat(cn)).concat(".Vault"))!
      self.receiverPath = rp
      self.publicPath = pp
      self.storagePath = sp
    }
  }

  pub event ProjectCreated(
    projectId: String,
    tokenType: Type,
    by: Address
  )

  pub event NewFundingCycle(
    projectId: String,
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
    projectId: String,
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64,
    amount: UFix64,
    by: Address,
    message: String
  )

  pub event Distribute(
    projectId: String,
    tokenType: Type,
    by: Address, 
    currentCycle: UInt64?,
    to: Address,
    amount: UFix64
  )

  pub event Donate(
    projectId: String,
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    vaultType: Type,
    by: Address
  )

  pub event Withdraw(
    projectId: String,
    tokenType: Type,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    by: Address
  )

  pub struct CycleTimeFrame {
    pub let startTime: UFix64
    pub let endTime: UFix64?

    init(_ st: UFix64, _ et: UFix64?) {
      pre {
        et == nil || (et! > st): "The end time must be greater than the start time."
        st >= getCurrentBlock().timestamp: "Start time must be now or in the future."
      }
      self.startTime = st
      self.endTime = et
    }
  }

  pub struct Payout {
    pub let address: Address
    pub let percent: UFix64

    init(_ a: Address, _ p: UFix64) {
      pre {
        p > 0.0 && p < 1.0: "percent must be a percantage."
      }
      self.address = a
      self.percent = p
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
    pub let extra: {String: AnyStruct}

    init(cycleNum: UInt64, fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeframe: CycleTimeFrame, payouts: [Payout], _ extra: {String: AnyStruct}) {
      pre {
        reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.cycleNum = cycleNum
      self.issuanceRate = issuanceRate
      self.fundingTarget = fundingTarget
      self.reserveRate = reserveRate
      self.timeframe = timeframe
      self.extra = extra

      // 2.5% goes to EC Treasury
      self.payouts = payouts.concat([Payout(Toucans.account.address, 0.025)])

      var percentCount: UFix64 = 0.0
      for payout in self.payouts {
        percentCount = percentCount + payout.percent
      }
      assert(percentCount <= 1.0, message: "Percents cannot be more than 100%.")
    }
  }

  pub struct FundingCycle {
    pub(set) var details: FundingCycleDetails
    pub var projectTokensPurchased: UFix64
    pub var paymentTokensSent: UFix64
    pub let funders: {Address: UFix64}

    // causer is either the payer or an admin converting overflow
    pub fun handlePaymentReceipt(projectTokensPurchased: UFix64, paymentTokensSent: UFix64, causer: Address) {
      self.projectTokensPurchased = self.projectTokensPurchased + projectTokensPurchased
      self.funders[causer] = (self.funders[causer] ?? 0.0) + paymentTokensSent
      self.paymentTokensSent = self.paymentTokensSent + paymentTokensSent
    }

    init(details: FundingCycleDetails) {
      self.details = details
      self.projectTokensPurchased = 0.0
      self.funders = {}
      self.paymentTokensSent = 0.0
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: String
    pub let projectTokenInfo: TokenInfo
    pub let paymentTokenInfo: TokenInfo
    pub var totalFunding: UFix64
    pub let editDelay: UFix64
    pub let minting: Bool

    // Setters
    pub fun proposeAction(action: {ToucansMultiSign.Action})
    // If the action is ready to execute, then allow anyone to do it.
    pub fun finalizeAction(actionUUID: UInt64)
    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address)
    pub fun purchase(paymentTokens: @FungibleToken.Vault, projectTokenReceiver: &{FungibleToken.Receiver}, message: String)
    pub fun claimOverflow(tokenVault: @FungibleToken.Vault, receiver: &{FungibleToken.Receiver})
    
    // Getters
    pub fun getCurrentIssuanceRate(): UFix64?
    pub fun getCurrentFundingCycle(): FundingCycle?
    pub fun getCurrentFundingCycleNum(): UInt64?
    pub fun getFundingCycles(): [FundingCycle]
    pub fun getVaultTypesInTreasury(): [Type]
    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64?
    pub fun getExtra(): {String: AnyStruct}
    pub fun getFunders(): {Address: UFix64}
    pub fun getOverflowBalance(): UFix64
    pub fun borrowManagerPublic(): &ToucansMultiSign.Manager{ToucansMultiSign.ManagerPublic}
  }

  pub resource Project: ProjectPublic {
    pub let projectId: String
    pub let projectTokenInfo: TokenInfo
    pub let paymentTokenInfo: TokenInfo
    // Of payment tokens
    pub var totalFunding: UFix64
    // You cannot edit or start a new cycle within this time frame
    pub let editDelay: UFix64
    pub let minting: Bool

    access(self) let fundingCycles: [FundingCycle]
    access(self) let treasury: @{Type: FungibleToken.Vault}
    access(self) let multiSignManager: @ToucansMultiSign.Manager
    access(self) let overflow: @FungibleToken.Vault
    access(self) let minter: @{Minter}
    access(self) let funders: {Address: UFix64}
    access(self) var extra: {String: AnyStruct}
    access(self) var additions: @{String: AnyResource}


    //  __  __       _ _   _    _____ _             
    // |  \/  |     | | | (_)  / ____(_)            
    // | \  / |_   _| | |_ _  | (___  _  __ _ _ __  
    // | |\/| | | | | | __| |  \___ \| |/ _` | '_ \ 
    // | |  | | |_| | | |_| |  ____) | | (_| | | | |
    // |_|  |_|\__,_|_|\__|_| |_____/|_|\__, |_| |_|
    //                                   __/ |      
    //                                  |___/       


    pub fun proposeAction(action: {ToucansMultiSign.Action}) {
      // Keep this restriction to prevent bad actions displaying
      pre {
        "0x".concat(action.getType().identifier.slice(from: 2, upTo: 18)) == Toucans.account.address.toString(): "Must be a type allowed by Toucans."
      }
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun finalizeAction(actionUUID: UInt64) {
      let selfRef: &Project = &self as &Project
      self.multiSignManager.finalizeAction(actionUUID: actionUUID, {"treasury": selfRef})
    }


    //   ______               _           _          
    //  |  ____|             | |         (_)         
    //  | |__ _   _ _ __   __| |_ __ __ _ _ ___  ___ 
    //  |  __| | | | '_ \ / _` | '__/ _` | / __|/ _ \
    //  | |  | |_| | | | | (_| | | | (_| | \__ \  __/
    //  |_|   \__,_|_| |_|\__,_|_|  \__,_|_|___/\___|
                                                         

    // NOTES:
    // If fundingTarget is nil, that means this is an on-going funding round,
    // and there is no limit. 
    pub fun configureFundingCycle(fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeframe: CycleTimeFrame, payouts: [Payout], extra: {String: AnyStruct}) {
      pre {
        getCurrentBlock().timestamp + self.editDelay <= timeframe.startTime: "You cannot configure a new cycle to start within the edit delay."
      }
      let cycleNum: UInt64 = UInt64(self.fundingCycles.length)

      let newFundingCycle: FundingCycle = FundingCycle(details: FundingCycleDetails(
        cycleNum: cycleNum,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        timeframe: timeframe,
        payouts: payouts,
        extra
      ))

      if cycleNum > 0 {
        // Make sure it doesn't conflict with a cycle before it
        let previousCycle: FundingCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        Toucans.assertNonConflictingCycles(earlierCycle: previousCycle.details, laterCycle: newFundingCycle.details)
      }
      
      self.fundingCycles.append(newFundingCycle)

      emit NewFundingCycle(
        projectId: self.projectId,
        tokenType: self.projectTokenInfo.tokenType,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        cycleNum: cycleNum,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        timeframe: timeframe
      )
    }

    // Allows you to edit a cycle that has not happened yet
    pub fun editUpcomingCycle(cycleNum: UInt64, details: FundingCycleDetails) {
      let fundingCycle: &FundingCycle = self.borrowFundingCycleRef(cycleNum: cycleNum)
      // This ensures the cycle is in the future
      assert(
        getCurrentBlock().timestamp + self.editDelay <= fundingCycle.details.timeframe.startTime,
        message: "You are no longer allowed to edit this upcoming cycle because of your edit delay." 
      )

      // Check the cycle above it, if it exists
      if Int(cycleNum) < self.fundingCycles.length - 1 {
        let aboveCycle = self.getFundingCycle(cycleNum: cycleNum + 1)
        assert(Toucans.assertNonConflictingCycles(earlierCycle: details, laterCycle: aboveCycle.details), message: "Conflicts with the cycle above it.")
      }

      // Check the cycle below it, if it exists
      if cycleNum > 0 {
        let belowCycle = self.getFundingCycle(cycleNum: cycleNum - 1)
        assert(Toucans.assertNonConflictingCycles(earlierCycle: belowCycle.details, laterCycle: details), message: "Conflicts with the cycle above it.")
      }

      fundingCycle.details = details
    }

    pub fun purchase(paymentTokens: @FungibleToken.Vault, projectTokenReceiver: &{FungibleToken.Receiver}, message: String) {
      pre {
        paymentTokens.getType() == self.paymentTokenInfo.tokenType: "This is not the correct payment."
      }
      let fundingCycleRef: &FundingCycle = self.borrowCurrentFundingCycleRef() ?? panic("There is no active cycle.")
      let paymentTokensSent: UFix64 = paymentTokens.balance
      let payer: Address = projectTokenReceiver.owner!.address

      let issuanceRate: UFix64 = self.getCurrentIssuanceRate()!
      let amount: UFix64 = issuanceRate * paymentTokensSent
      let mintedTokens <- self.minter.mint(amount: amount)
      assert(mintedTokens.getType() == self.projectTokenInfo.tokenType, message: "Someone is messing with the minter. It's not minting the original type.")
      assert(amount == mintedTokens.balance, message: "Not enough tokens were minted.")

      // Tax the purchased tokens with reserve rate
      let tax: @FungibleToken.Vault <- mintedTokens.withdraw(amount: mintedTokens.balance * fundingCycleRef.details.reserveRate)
      // Deposit new tokens to payer
      projectTokenReceiver.deposit(from: <- mintedTokens)
      // Deposit tax to project treasury
      self.depositToTreasury(vault: <- tax)

      // Calculate payouts
      for payout in fundingCycleRef.details.payouts {
        Toucans.depositTokensToAccount(funds: <- paymentTokens.withdraw(amount: paymentTokensSent * payout.percent), to: payout.address, publicPath: self.paymentTokenInfo.receiverPath)
      }

      // No overflow if:
      // 1. Funding target is nil
      // 2. The amount sent + current sent <= the target
      let fundingTarget = fundingCycleRef.details.fundingTarget
      if fundingTarget == nil || (fundingCycleRef.paymentTokensSent + paymentTokensSent <= fundingTarget!) {
        // No overflow, deposit the rest right to treasury
        self.depositToTreasury(vault: <- paymentTokens)
      } else {
        let amountToTreasury = fundingTarget! - fundingCycleRef.paymentTokensSent
        self.depositToTreasury(vault: <- paymentTokens.withdraw(amount: amountToTreasury))
        self.depositToOverflow(vault: <- paymentTokens)
      }

      fundingCycleRef.handlePaymentReceipt(projectTokensPurchased: amount, paymentTokensSent: paymentTokensSent, causer: payer)
      // Tokens were purchased, so increment amount raised
      self.totalFunding = self.totalFunding + paymentTokensSent
      self.funders[payer] = (self.funders[payer] ?? 0.0) + paymentTokensSent
      emit Purchase(
        projectId: self.projectId,
        tokenType: self.projectTokenInfo.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum()!,
        amount: paymentTokensSent,
        by: payer,
        message: message
      )
    }


    //   _    _      _                 
    //  | |  | |    | |                
    //  | |__| | ___| |_ __   ___ _ __ 
    //  |  __  |/ _ \ | '_ \ / _ \ '__|
    //  | |  | |  __/ | |_) |  __/ |   
    //  |_|  |_|\___|_| .__/ \___|_|   
    //                | |              
    //                |_|              


    access(self) fun depositToTreasury(vault: @FungibleToken.Vault) {
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    access(self) fun depositToOverflow(vault: @FungibleToken.Vault) {
      pre {
        vault.getType() == self.paymentTokenInfo.tokenType: "Not payment token type."
      }
      self.overflow.deposit(from: <- vault)
    }

    access(account) fun borrowManager(): &ToucansMultiSign.Manager {
      return &self.multiSignManager as &ToucansMultiSign.Manager
    }

    access(account) fun withdrawFromTreasury(vault: &{FungibleToken.Receiver}, amount: UFix64) {
      emit Withdraw(
        projectId: self.projectId,
        tokenType: self.projectTokenInfo.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        amount: amount,
        by: vault.owner!.address
      )
      vault.deposit(from: <- self.treasury[vault.getType()]?.withdraw!(amount: amount))
    }

    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address) {
      emit Donate(
        projectId: self.projectId,
        tokenType: self.projectTokenInfo.tokenType,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        amount: vault.balance,
        vaultType: vault.getType(),
        by: payer
      )
      if let existingVault = &self.treasury[vault.getType()] as &FungibleToken.Vault? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }


    //   __  __ _       _   _             
    //  |  \/  (_)     | | (_)            
    //  | \  / |_ _ __ | |_ _ _ __   __ _ 
    //  | |\/| | | '_ \| __| | '_ \ / _` |
    //  | |  | | | | | | |_| | | | | (_| |
    //  |_|  |_|_|_| |_|\__|_|_| |_|\__, |
    //                               __/ |
    //                              |___/ 


    pub fun distribute(recipient: Address, amount: UFix64) {
      pre {
        self.minting: "Minting is off. You cannot do this."
      }

      let recipientVault = getAccount(recipient).getCapability(self.projectTokenInfo.publicPath)
                      .borrow<&{FungibleToken.Receiver}>() ?? panic("The recipient does not have a Vault set up.")
      let tokens <- self.minter.mint(amount: amount)
      recipientVault.deposit(from: <- tokens)

      emit Distribute(
        projectId: self.projectId,
        tokenType: self.projectTokenInfo.tokenType,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        to: recipient,
        amount: amount
      )
    }


    //    ____                  __ _               
    //   / __ \                / _| |              
    //  | |  | |_   _____ _ __| |_| | _____      __
    //  | |  | \ \ / / _ \ '__|  _| |/ _ \ \ /\ / /
    //  | |__| |\ V /  __/ |  | | | | (_) \ V  V / 
    //   \____/  \_/ \___|_|  |_| |_|\___/ \_/\_/  
                                                                        

    pub fun convertOverflow(amount: UFix64) {
      let cycle = self.borrowCurrentFundingCycleRef() ?? panic("There must be an active funding cycle in order to do this.")
      let overflow <- self.treasury[self.paymentTokenInfo.tokenType]?.withdraw!(amount: amount)
      cycle.handlePaymentReceipt(projectTokensPurchased: 0.0, paymentTokensSent: overflow.balance, causer: self.owner!.address)
      self.depositToTreasury(vault: <- overflow)
    }

    pub fun claimOverflow(tokenVault: @FungibleToken.Vault, receiver: &{FungibleToken.Receiver}) {
      pre {
        tokenVault.getType() == self.projectTokenInfo.tokenType: "This is not the project's token."
      }
      let balance: UFix64 = tokenVault.balance
      let totalSupply: UFix64 = getAccount(self.projectTokenInfo.contractAddress).contracts.borrow<&FungibleToken>(name: self.projectTokenInfo.contractName)!.totalSupply
      let percent: UFix64 = balance / totalSupply

      let receiverType: Type = receiver.getType()
      let treasuryFlowBalance = self.getVaultBalanceInTreasury(vaultType: receiverType)!

      receiver.deposit(from: <- self.treasury[receiverType]?.withdraw!(amount: treasuryFlowBalance * percent))
      self.depositToTreasury(vault: <- tokenVault)
    }


    //    _____      _   _                
    //   / ____|    | | | |               
    //  | |  __  ___| |_| |_ ___ _ __ ___ 
    //  | | |_ |/ _ \ __| __/ _ \ '__/ __|
    //  | |__| |  __/ |_| ||  __/ |  \__ \
    //   \_____|\___|\__|\__\___|_|  |___/
                                   
                                   
    pub fun getVaultTypesInTreasury(): [Type] {
      return self.treasury.keys
    }

    // Returns nil if the requested type doesn't exist in the treasury
    pub fun getVaultBalanceInTreasury(vaultType: Type): UFix64? {
      return self.treasury[vaultType]?.balance
    }

    // Returns nil if there is no current round
    pub fun getCurrentFundingCycle(): FundingCycle? {
      let currentTime: UFix64 = getCurrentBlock().timestamp
      var i: Int = self.fundingCycles.length - 1

      while i >= 0 {
        let cycle: FundingCycle = self.fundingCycles[i]
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

    pub fun getCurrentFundingCycleNum(): UInt64? {
      let currentCycle = self.getCurrentFundingCycle()
      return currentCycle?.details?.cycleNum
    }

    // Returns nil if there is no current round
    pub fun getCurrentIssuanceRate(): UFix64? {
      return self.getCurrentFundingCycle()?.details?.issuanceRate
    }

    pub fun getFundingCycle(cycleNum: UInt64): FundingCycle {
      return self.fundingCycles[cycleNum]
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

    pub fun getOverflowBalance(): UFix64 {
      return self.overflow.balance
    }


    //   ____                               
    //  |  _ \                              
    //  | |_) | ___  _ __ _ __ _____      __
    //  |  _ < / _ \| '__| '__/ _ \ \ /\ / /
    //  | |_) | (_) | |  | | | (_) \ V  V / 
    //  |____/ \___/|_|  |_|  \___/ \_/\_/  
                                                                

    access(self) fun borrowFundingCycleRef(cycleNum: UInt64): &FundingCycle {
      return &self.fundingCycles[cycleNum] as &FundingCycle
    }

    access(self) fun borrowCurrentFundingCycleRef(): &FundingCycle? {
      if let currentCycle: FundingCycle = self.getCurrentFundingCycle() {
        return self.borrowFundingCycleRef(cycleNum: currentCycle.details.cycleNum)
      }
      return nil
    }

    pub fun borrowManagerPublic(): &ToucansMultiSign.Manager{ToucansMultiSign.ManagerPublic} {
      return &self.multiSignManager as &ToucansMultiSign.Manager{ToucansMultiSign.ManagerPublic}
    }

    init(
      projectTokenInfo: TokenInfo,
      paymentTokenInfo: TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      signers: [Address],
      threshold: UInt64,
      minting: Bool,
      extra: {String: AnyStruct}
    ) {
      self.projectId = projectTokenInfo.contractName
      self.totalFunding = 0.0
      self.extra = extra
      self.fundingCycles = []
      self.minter <- minter
      self.funders = {}
      self.editDelay = editDelay
      self.projectTokenInfo = projectTokenInfo
      self.paymentTokenInfo = paymentTokenInfo
      self.minting = minting
      self.additions <- {}

      let testMint: @FungibleToken.Vault <- self.minter.mint(amount: 0.0)
      assert(testMint.getType() == projectTokenInfo.tokenType, message: "The passed in minter did not mint the correct token type.")
      let paymentContract = getAccount(paymentTokenInfo.contractAddress).contracts.borrow<&FungibleToken>(name: paymentTokenInfo.contractName)!
      let emptyPaymentVault <- paymentContract.createEmptyVault()
      self.treasury <- {projectTokenInfo.tokenType: <- testMint, emptyPaymentVault.getType(): <- emptyPaymentVault}
      self.overflow <- paymentContract.createEmptyVault()
      self.multiSignManager <- ToucansMultiSign.createMultiSigManager(signers: signers, threshold: threshold)
    }

    destroy() {
      destroy self.treasury
      destroy self.minter
      destroy self.overflow
      destroy self.multiSignManager
      destroy self.additions
    }
  }

  pub resource interface CollectionPublic {
    pub fun getProjectIds(): [String]
    pub fun borrowProjectPublic(projectId: String): &Project{ProjectPublic}?
  }

  pub resource Collection: CollectionPublic {
    pub let projects: @{String: Project}

    pub fun createProject(
      projectTokenInfo:TokenInfo, 
      paymentTokenInfo: TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      signers: [Address],
      threshold: UInt64,
      minting: Bool,
      extra: {String: AnyStruct}
    ) {
      let cycleNum: UInt64 = 0

      let project: @Project <- create Project(projectTokenInfo: projectTokenInfo, paymentTokenInfo: paymentTokenInfo, minter: <- minter, editDelay: editDelay, signers: signers, threshold: threshold, minting: minting, extra: extra)
      let projectId: String = projectTokenInfo.contractName
      self.projects[projectId] <-! project

      emit ProjectCreated(
        projectId: projectId,
        tokenType: projectTokenInfo.tokenType,
        by: self.owner!.address
      )
    }

    pub fun borrowProject(projectId: String): &Project? {
      return &self.projects[projectId] as &Project?
    }

    pub fun getProjectIds(): [String] {
      return self.projects.keys
    }

    pub fun borrowProjectPublic(projectId: String): &Project{ProjectPublic}? {
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

  pub fun assertNonConflictingCycles(earlierCycle: FundingCycleDetails, laterCycle: FundingCycleDetails): Bool {
    let earlierCycleStartsEarlier = earlierCycle.timeframe.startTime < laterCycle.timeframe.startTime
    let earlierCycleEndsBeforeLaterStarts = earlierCycle.timeframe.endTime == nil || (earlierCycle.timeframe.endTime! < laterCycle.timeframe.startTime)
    return earlierCycleStartsEarlier && earlierCycleEndsBeforeLaterStarts
  }

  init() {
    self.CollectionStoragePath = /storage/ToucansCollection002
    self.CollectionPublicPath = /public/ToucansCollection002
  }

}
 