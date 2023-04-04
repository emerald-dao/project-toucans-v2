import FungibleToken from "./utility/FungibleToken.cdc"
import Crypto
import ToucansTokens from "./ToucansTokens.cdc"
import ToucansUtils from "./ToucansUtils.cdc"
import ToucansActions from "./ToucansActions.cdc"

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
    projectId: String,
    tokenTypeIdentifier: String,
    by: Address
  )

  pub event NewFundingCycle(
    projectId: String,
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
    projectOwner: Address, 
    currentCycle: UInt64,
    tokenSymbol: String,
    amount: UFix64,
    by: Address,
    message: String
  )

  pub event Donate(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    tokenSymbol: String,
    by: Address,
    message: String
  )

  // Multi Sign Actions
  pub event Withdraw(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    amount: UFix64,
    by: Address
  )
  pub event Distribute(
    projectId: String,
    by: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    to: Address,
    amount: UFix64
  )
  pub event AddSigner(projectId: String, signer: Address)
  pub event RemoveSigner(projectId: String, signer: Address)
  pub event UpdateThreshold(projectId: String, newThreshold: UInt64)

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

      // 5% goes to EC Treasury
      self.payouts = payouts.concat([Payout(Toucans.account.address, 0.05)])

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
    // The total amount of payment tokens sent through
    pub var paymentTokensSent: UFix64
    // The amount towards the goal (is capped at `details.fundingTarget`)
    pub var raisedTowardsGoal: UFix64
    pub let funders: {Address: UFix64}

    // called when a purchase happens
    pub fun handlePaymentReceipt(projectTokensPurchased: UFix64, paymentTokensSent: UFix64, payer: Address) {
      self.projectTokensPurchased = self.projectTokensPurchased + projectTokensPurchased
      self.funders[payer] = (self.funders[payer] ?? 0.0) + paymentTokensSent
      self.paymentTokensSent = self.paymentTokensSent + paymentTokensSent
    }

    // called when overflow is converted
    pub fun raise(amount: UFix64) {
      post {
        self.details.fundingTarget == nil || (self.raisedTowardsGoal <= self.details.fundingTarget!):
          "Cannot raise more than the funding target."
      }

      self.raisedTowardsGoal = self.raisedTowardsGoal + amount
    }

    init(details: FundingCycleDetails) {
      self.details = details
      self.projectTokensPurchased = 0.0
      self.raisedTowardsGoal = 0.0
      self.funders = {}
      self.paymentTokensSent = 0.0
    }
  }

  pub resource interface ProjectPublic {
    pub let projectId: String
    pub let projectTokenInfo: ToucansTokens.TokenInfo
    pub let paymentTokenInfo: ToucansTokens.TokenInfo
    pub var totalFunding: UFix64
    pub let editDelay: UFix64
    pub let minting: Bool

    // Setters
    // Some proposals we think make sense to be public initially
    pub fun proposeWithdraw(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64)
    pub fun proposeMint(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64)
    // If the action is ready to execute, then allow anyone to do it.
    pub fun finalizeAction(actionUUID: UInt64)
    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address, message: String)
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
    pub fun borrowManagerPublic(): &Manager{ManagerPublic}
  }

  pub resource Project: ProjectPublic {
    pub let projectId: String
    pub let projectTokenInfo: ToucansTokens.TokenInfo
    pub let paymentTokenInfo: ToucansTokens.TokenInfo
    // Of payment tokens
    pub var totalFunding: UFix64
    // You cannot edit or start a new cycle within this time frame
    pub let editDelay: UFix64
    pub let minting: Bool

    access(self) let fundingCycles: [FundingCycle]
    access(self) let treasury: @{Type: FungibleToken.Vault}
    access(self) let multiSignManager: @Manager
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


    pub fun proposeWithdraw(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
      let tokenInfo = self.getTokenInfo(inputVaultType: recipientVault.borrow()!.getType()) 
                ?? panic("Unsupported token type for withdrawing.")
      let action = ToucansActions.WithdrawToken(recipientVault, amount, tokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun proposeMint(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
      pre {
        recipientVault.borrow()!.getType() == self.projectTokenInfo.tokenType: 
          "This vault cannot receive the projects token."
        self.minting: "Minting is turned off."
      }
      let action = ToucansActions.MintTokens(recipientVault, amount, tokenSymbol: self.projectTokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun proposeMintToTreasury(amount: UFix64) {
      pre {
        self.minting: "Minting is turned off."
      }
      let action = ToucansActions.MintTokensToTreasury(amount, tokenSymbol: self.projectTokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun proposeAddSigner(signer: Address) {
      let action = ToucansActions.AddOneSigner(signer)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun proposeRemoveSigner(signer: Address) {
      let action = ToucansActions.RemoveOneSigner(signer)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun proposeUpdateThreshold(threshold: UInt64) {
      let action = ToucansActions.UpdateTreasuryThreshold(threshold)
      self.multiSignManager.createMultiSign(action: action)
    }

    pub fun finalizeAction(actionUUID: UInt64) {
      post {
        self.multiSignManager.getSigners().contains(self.owner!.address): "Don't allow the project owner to get removed as a signer."
      }
      assert(
        self.multiSignManager.readyToFinalize(actionUUID: actionUUID),
        message: "Cannot finalize this action yet."
      )
      let actionWrapper: &MultiSignAction = self.multiSignManager.borrowAction(actionUUID: actionUUID)
      let action: {ToucansActions.Action} = actionWrapper.action
      switch action.getType() {
        case Type<ToucansActions.WithdrawToken>():
          let withdraw = action as! ToucansActions.WithdrawToken
          self.withdrawFromTreasury(vault: withdraw.recipientVault.borrow()!, amount: withdraw.amount)
        case Type<ToucansActions.MintTokens>():
          let mint = action as! ToucansActions.MintTokens
          self.mint(recipientVault: mint.recipientVault.borrow()!, amount: mint.amount)
        case Type<ToucansActions.MintTokensToTreasury>():
          let mint = action as! ToucansActions.MintTokensToTreasury
          let ref: &FungibleToken.Vault = (&self.treasury[self.projectTokenInfo.tokenType] as &FungibleToken.Vault?)!
          self.mint(recipientVault: ref, amount: mint.amount)
        case Type<ToucansActions.AddOneSigner>():
          let addSigner = action as! ToucansActions.AddOneSigner
          self.multiSignManager.addSigner(signer: addSigner.signer)
          emit AddSigner(projectId: self.projectId, signer: addSigner.signer)
        case Type<ToucansActions.RemoveOneSigner>():
          let removeSigner = action as! ToucansActions.RemoveOneSigner
          self.multiSignManager.removeSigner(signer: removeSigner.signer)
          emit AddSigner(projectId: self.projectId, signer: removeSigner.signer)
        case Type<ToucansActions.UpdateTreasuryThreshold>():
          let updateThreshold = action as! ToucansActions.UpdateTreasuryThreshold
          self.multiSignManager.updateThreshold(newThreshold: updateThreshold.threshold)
          emit UpdateThreshold(projectId: self.projectId, newThreshold: updateThreshold.threshold)
      }

      // Will delete the action and make sure everything is good to go
      self.multiSignManager.finalizeAction(actionUUID: actionUUID)
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
      fundingCycleRef.handlePaymentReceipt(projectTokensPurchased: mintedTokens.balance, paymentTokensSent: paymentTokensSent, payer: payer)
      // Deposit new tokens to payer
      projectTokenReceiver.deposit(from: <- mintedTokens)
      // Deposit tax to project treasury
      self.depositToTreasury(vault: <- tax)

      // Calculate payouts
      for payout in fundingCycleRef.details.payouts {
        ToucansUtils.depositTokensToAccount(funds: <- paymentTokens.withdraw(amount: paymentTokensSent * payout.percent), to: payout.address, publicPath: self.paymentTokenInfo.receiverPath)
      }

      // 3 cases:
      // 1. Funding target is nil OR amount sent won't exceed the target (deposit everything to treasury)
      // 2. Funding goal is already reached (deposit everything to overflow)
      // 3. Amount sent will make us reach the goal (split between overflow and treasury)
      let fundingTarget: UFix64? = fundingCycleRef.details.fundingTarget
      let amountLeftToTreasury: UFix64 = paymentTokens.balance
      if fundingTarget == nil || (fundingCycleRef.raisedTowardsGoal + amountLeftToTreasury <= fundingTarget!) {
        // Deposit everything to treasury because there's no such thing as overflow
        fundingCycleRef.raise(amount: paymentTokens.balance)
        self.depositToTreasury(vault: <- paymentTokens)
      } else if fundingCycleRef.raisedTowardsGoal == fundingTarget! {
        // deposit everything to overflow
        self.depositToOverflow(vault: <- paymentTokens)
      } else {
        let amountToTreasury: UFix64 = fundingTarget! - fundingCycleRef.raisedTowardsGoal
        fundingCycleRef.raise(amount: amountToTreasury)
        self.depositToTreasury(vault: <- paymentTokens.withdraw(amount: amountToTreasury))
        self.depositToOverflow(vault: <- paymentTokens)
      }
  
      // Tokens were purchased, so increment amount raised
      self.totalFunding = self.totalFunding + paymentTokensSent
      self.funders[payer] = (self.funders[payer] ?? 0.0) + paymentTokensSent
      emit Purchase(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: fundingCycleRef.details.cycleNum,
        tokenSymbol: self.paymentTokenInfo.symbol,
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

    access(account) fun borrowManager(): &Manager {
      return &self.multiSignManager as &Manager
    }

    pub fun getTokenInfo(inputVaultType: Type): ToucansTokens.TokenInfo? {
      if inputVaultType == self.projectTokenInfo.tokenType {
        return self.projectTokenInfo
      } else if let tokenInfo = ToucansTokens.getTokenInfo(tokenType: inputVaultType) {
        return tokenInfo
      }
      return nil
    }

    access(account) fun withdrawFromTreasury(vault: &{FungibleToken.Receiver}, amount: UFix64) {
      let tokenInfo = self.getTokenInfo(inputVaultType: vault.getType()) 
                ?? panic("Unsupported token type for withdrawing.")
      emit Withdraw(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        tokenSymbol: tokenInfo.symbol,
        amount: amount,
        by: vault.owner!.address
      )
      vault.deposit(from: <- self.treasury[vault.getType()]?.withdraw!(amount: amount))
    }

    pub fun donateToTreasury(vault: @FungibleToken.Vault, payer: Address, message: String) {
      let tokenInfo = self.getTokenInfo(inputVaultType: vault.getType())
                ?? panic("Unsupported token type for donating.")
      emit Donate(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        amount: vault.balance,
        tokenSymbol: tokenInfo.symbol,
        by: payer,
        message: message
      )
      if vault.getType() == self.paymentTokenInfo.tokenType {
        self.totalFunding = self.totalFunding + vault.balance
        self.funders[payer] = (self.funders[payer] ?? 0.0) + vault.balance
      }
      self.depositToTreasury(vault: <- vault)
    }


    //   __  __ _       _   _             
    //  |  \/  (_)     | | (_)            
    //  | \  / |_ _ __ | |_ _ _ __   __ _ 
    //  | |\/| | | '_ \| __| | '_ \ / _` |
    //  | |  | | | | | | |_| | | | | (_| |
    //  |_|  |_|_|_| |_|\__|_|_| |_|\__, |
    //                               __/ |
    //                              |___/ 


    access(account) fun mint(recipientVault: &{FungibleToken.Receiver}, amount: UFix64) {
      pre {
        self.minting: "Minting is off. You cannot do this."
      }

      let tokens <- self.minter.mint(amount: amount)
      recipientVault.deposit(from: <- tokens)

      emit Distribute(
        projectId: self.projectId,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleNum(),
        tokenSymbol: self.projectTokenInfo.symbol,
        to: recipientVault.owner!.address,
        amount: amount
      )
    }


    //    ____                  __ _               
    //   / __ \                / _| |              
    //  | |  | |_   _____ _ __| |_| | _____      __
    //  | |  | \ \ / / _ \ '__|  _| |/ _ \ \ /\ / /
    //  | |__| |\ V /  __/ |  | | | | (_) \ V  V / 
    //   \____/  \_/ \___|_|  |_| |_|\___/ \_/\_/  
                                                                        

    // can only be called if amount does not put us over the funding target
    pub fun convertOverflow(amount: UFix64) {
      let cycle = self.borrowCurrentFundingCycleRef() ?? panic("There must be an active funding cycle in order to do this.")
      let overflow <- self.treasury[self.paymentTokenInfo.tokenType]?.withdraw!(amount: amount)
      // will fail if this puts the cycle over the funding target
      cycle.raise(amount: amount)
      self.depositToTreasury(vault: <- overflow)
    }

    pub fun claimOverflow(tokenVault: @FungibleToken.Vault, receiver: &{FungibleToken.Receiver}) {
      pre {
        tokenVault.getType() == self.projectTokenInfo.tokenType: "This is not the project's token."
      }
      let balance: UFix64 = tokenVault.balance
      let totalSupply: UFix64 = getAccount(self.projectTokenInfo.contractAddress).contracts.borrow<&FungibleToken>(name: self.projectTokenInfo.contractName)!.totalSupply
      let percent: UFix64 = balance / totalSupply
      assert(percent >= 0.0 && percent <= 1.0, message: "Percent must be a percent value.")

      let treasuryBalanceForType = self.getVaultBalanceInTreasury(vaultType: receiver.getType())!

      self.withdrawFromTreasury(vault: receiver, amount: treasuryBalanceForType * percent)
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

    pub fun borrowManagerPublic(): &Manager{ManagerPublic} {
      return &self.multiSignManager as &Manager{ManagerPublic}
    }

    init(
      projectTokenInfo: ToucansTokens.TokenInfo,
      paymentTokenInfo: ToucansTokens.TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      signers: [Address],
      threshold: UInt64,
      minting: Bool,
      initialSupply: UFix64,
      extra: {String: AnyStruct}
    ) {
      pre {
        ToucansTokens.getTokenInfo(tokenType: paymentTokenInfo.tokenType) != nil: "Unsupported token type for payment."
      }
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

      let initialVault: @FungibleToken.Vault <- self.minter.mint(amount: initialSupply)
      assert(initialVault.getType() == projectTokenInfo.tokenType, message: "The passed in minter did not mint the correct token type.")
      let paymentContract = getAccount(paymentTokenInfo.contractAddress).contracts.borrow<&FungibleToken>(name: paymentTokenInfo.contractName)!
      let emptyPaymentVault <- paymentContract.createEmptyVault()
      self.treasury <- {projectTokenInfo.tokenType: <- initialVault, emptyPaymentVault.getType(): <- emptyPaymentVault}
      self.overflow <- paymentContract.createEmptyVault()
      self.multiSignManager <- create Manager(_initialSigners: signers, _initialThreshold: threshold)
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
      projectTokenInfo: ToucansTokens.TokenInfo, 
      paymentTokenInfo: ToucansTokens.TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      signers: [Address],
      threshold: UInt64,
      minting: Bool,
      initialSupply: UFix64,
      extra: {String: AnyStruct}
    ) {
      pre {
        signers.contains(self.owner!.address): "Project owner must be one of the initial signers."
      }
      let cycleNum: UInt64 = 0

      let project: @Project <- create Project(projectTokenInfo: projectTokenInfo, paymentTokenInfo: paymentTokenInfo, minter: <- minter, editDelay: editDelay, signers: signers, threshold: threshold, minting: minting, initialSupply: initialSupply, extra: extra)
      let projectId: String = projectTokenInfo.contractName
      self.projects[projectId] <-! project

      emit ProjectCreated(
        projectId: projectId,
        tokenTypeIdentifier: projectTokenInfo.tokenType.identifier,
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


  //   __  __                                   
  //  |  \/  |                                  
  //  | \  / | __ _ _ __   __ _  __ _  ___ _ __ 
  //  | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|
  //  | |  | | (_| | | | | (_| | (_| |  __/ |   
  //  |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|   
  //                             __/ |          
  //                            |___/      


  pub enum ActionState: UInt8 {
    pub case ACCEPTED
    pub case DECLINED
    pub case PENDING
  }

  pub resource MultiSignAction {
      pub let action: {ToucansActions.Action}
      access(self) let signers: [Address]
      access(self) let votes: {Address: Bool}
      pub let threshold: UInt64

      pub fun decline(acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {
        pre {
          self.signers.contains(acctAddress): "This person cannot vote."
        }
        let sign = ToucansUtils.verifySignature(uuid: self.uuid, intent: self.action.getIntent(), acctAddress: acctAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)
        if sign {
          self.votes[acctAddress] = false
        }
      }

      pub fun accept(acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {
        pre {
          self.signers.contains(acctAddress): "This person cannot vote."
        }
        let sign = ToucansUtils.verifySignature(uuid: self.uuid, intent: self.action.getIntent(), acctAddress: acctAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)
        if sign {
          self.votes[acctAddress] = true
        }
      }

      pub fun getSigners(): [Address] {
          return self.signers
      }

      // Only returns people who have actually voted
      pub fun getVotes(): {Address: Bool} {
        return self.votes
      }

      pub fun getAccepted(): UInt64 {
        var count: UInt64 = 0
        for voter in self.votes.keys {
            if self.votes[voter]! {
                count = count + 1
            }
        }
        return count
      }

      pub fun getDeclined(): UInt64 {
        var count: UInt64 = 0
        for voter in self.votes.keys {
            if !self.votes[voter]! {
                count = count + 1
            }
        }
        return count
      }

      pub fun getActionState(): ActionState {
        // If this action is to add a signer,
        // and the person being added declined it,
        // it is automatically declined.
        if self.action.getType() == Type<ToucansActions.AddOneSigner>() {
          let addSignerAction: ToucansActions.AddOneSigner = self.action as! ToucansActions.AddOneSigner
          if self.votes[addSignerAction.signer] == false {
            return ActionState.DECLINED
          }
        }

        if self.getAccepted() >= self.threshold {
            return ActionState.ACCEPTED
        }
        if self.getDeclined() > UInt64(self.getSigners().length) - self.threshold {
            return ActionState.DECLINED
        }

        return ActionState.PENDING
      }

      init(_threshold: UInt64, _signers: [Address], _action: {ToucansActions.Action}) {
        self.threshold = _threshold
        self.signers = _signers
        self.votes = {}
        self.action = _action
      }
  }

  pub resource interface ManagerPublic {
      pub var threshold: UInt64
      pub fun borrowAction(actionUUID: UInt64): &MultiSignAction
      pub fun getActionState(actionUUID: UInt64): ActionState
      pub fun readyToFinalize(actionUUID: UInt64): Bool
      pub fun getIDs(): [UInt64]
      pub fun getSigners(): [Address]
  }
  
  pub resource Manager: ManagerPublic {
    pub var threshold: UInt64
    access(self) let signers: {Address: Bool}
    // Maps the `uuid` of the MultiSignAction
    // to the resource itself
    access(self) let actions: @{UInt64: MultiSignAction}

    pub fun createMultiSign(action: {ToucansActions.Action}) {
      var threshold: UInt64 = self.threshold
      var signers: [Address] = self.signers.keys
      if action.getType() == Type<ToucansActions.AddOneSigner>() {
        let addSignerAction = action as! ToucansActions.AddOneSigner
        threshold = threshold + 1
        signers.append(addSignerAction.signer)
      }
      let newAction <- create MultiSignAction(_threshold: threshold, _signers: signers, _action: action)
      self.actions[newAction.uuid] <-! newAction
    }

    pub fun getActionState(actionUUID: UInt64): ActionState {
      let actionRef: &MultiSignAction = (&self.actions[actionUUID] as &MultiSignAction?)!
      return actionRef.getActionState()
    }

    pub fun readyToFinalize(actionUUID: UInt64): Bool {
      let actionState: ActionState = self.getActionState(actionUUID: actionUUID)
      return actionState != ActionState.PENDING
    }

    // We do not make this public because if anyone else wants to use
    // this contract, they may want specific access control over who can
    // actually execute an action, post conditions, and/or implement requirements
    // (like the treasury must have >= 10 $FLOW before an action can be executed).
    pub fun finalizeAction(actionUUID: UInt64) {
      destroy self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
      self.assertValidTreasury()
    }

    // These will be multisign actions themselves
    access(account) fun addSigner(signer: Address) {
      self.signers.insert(key: signer, true)
      self.assertValidTreasury()
    }

    access(account) fun removeSigner(signer: Address) {
      self.signers.remove(key: signer)

      if Int(self.threshold) > self.signers.length {
        // Automatically reduce the threshold to prevent it from
        // being higher than the number of signers
        self.threshold = UInt64(self.signers.length)
      }

      self.assertValidTreasury()
    }

    access(account) fun updateThreshold(newThreshold: UInt64) {
      self.threshold = newThreshold
      self.assertValidTreasury()
    }

    pub fun borrowAction(actionUUID: UInt64): &MultiSignAction {
      return (&self.actions[actionUUID] as &MultiSignAction?)!
    }

    pub fun getIDs(): [UInt64] {
      return self.actions.keys
    }

    pub fun getSigners(): [Address] {
      return self.signers.keys
    }

    pub fun assertValidTreasury() {
      assert(self.threshold > 0, message: "Threshold must be greater than 0.")
      assert(self.signers.length > 0, message: "Number of signers must be greater than 0.")
      assert(self.signers.length >= Int(self.threshold), message: "Number of signers must be greater than or equal to the threshold.")
    }

    init(_initialSigners: [Address], _initialThreshold: UInt64) {
      self.signers = {}
      self.actions <- {}
      self.threshold = _initialThreshold

      for signer in _initialSigners {
        self.signers.insert(key: signer, true)
      }

      self.assertValidTreasury()
    }

    destroy() {
      destroy self.actions
    }
  }
      
  pub fun createMultiSigManager(signers: [Address], threshold: UInt64): @Manager {
      return <- create Manager(_initialSigners: signers, _initialThreshold: threshold)
  }

  pub fun createCollection(): @Collection {
    return <- create Collection()
  }

  pub fun assertNonConflictingCycles(earlierCycle: FundingCycleDetails, laterCycle: FundingCycleDetails): Bool {
    let earlierCycleStartsEarlier = earlierCycle.timeframe.startTime < laterCycle.timeframe.startTime
    let earlierCycleEndsBeforeLaterStarts = earlierCycle.timeframe.endTime == nil || (earlierCycle.timeframe.endTime! < laterCycle.timeframe.startTime)
    return earlierCycleStartsEarlier && earlierCycleEndsBeforeLaterStarts
  }

  init() {
    self.CollectionStoragePath = /storage/ToucansCollection003
    self.CollectionPublicPath = /public/ToucansCollection003
  }

}
 