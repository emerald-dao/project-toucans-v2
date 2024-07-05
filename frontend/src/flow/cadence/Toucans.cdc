import "FungibleToken"
import Crypto
import "ToucansTokens"
import "ToucansUtils"
import "ToucansActions"
import "FlowToken"
import "ToucansLockTokens"
import "NonFungibleToken"
import "NFTCatalog"
import "SwapInterfaces"
import "stFlowToken"
import "SwapError"
import "Burner"

access(all) contract Toucans {

  access(all) entitlement ProjectOwner
  access(all) entitlement CollectionOwner

  access(all) let CollectionStoragePath: StoragePath
  access(all) let CollectionPublicPath: PublicPath

  access(all) resource interface Minter {
    access(all) fun mint(amount: UFix64): @{FungibleToken.Vault} {
      post {
        result.balance == amount: "Did not mint correct number of tokens."
      }
    }
  }

  access(all) resource DummyMinter: Minter {
    access(all) fun mint(amount: UFix64): @{FungibleToken.Vault} {
      return <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
    }
  }

  access(all) event ProjectCreated(
    projectId: String,
    tokenTypeIdentifier: String?,
    by: Address
  )

  access(all) event NewFundingCycle(
    projectId: String,
    projectOwner: Address,
    newCycleId: UInt64,
    fundingTarget: UFix64?,
    issuanceRate: UFix64,
    reserveRate: UFix64,
    timeframe: CycleTimeFrame?
  )

  access(all) event Purchase(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64,
    tokenSymbol: String,
    amount: UFix64,
    by: Address,
    message: String
  )

  access(all) event Donate(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64?,
    amount: UFix64,
    tokenSymbol: String,
    by: Address,
    message: String
  )

  access(all) event DonateNFT(
    projectId: String,
    projectOwner: Address, 
    amount: UInt64,
    uuids: [UInt64],
    collectionIdentifier: String,
    collectionName: String,
    collectionExternalURL: String,
    by: Address,
    message: String
  )

  // Multi Sign Actions
  access(all) event Withdraw(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    amount: UFix64,
    to: Address
  )
  access(all) event BatchWithdraw(
    projectId: String,
    projectOwner: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    amounts: {Address: UFix64},
    amount: UFix64,
    failed: [Address]
  )
  access(all) event WithdrawNFTs(
    projectId: String,
    projectOwner: Address, 
    collectionIdentifier: String,
    collectionName: String,
    collectionExternalURL: String,
    amount: UInt64,
    to: Address,
    message: String
  )
  access(all) event Mint(
    projectId: String,
    by: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    to: Address,
    amount: UFix64
  )
  access(all) event BatchMint(
    projectId: String,
    by: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    amounts: {Address: UFix64},
    amount: UFix64,
    failed: [Address]
  )
  access(all) event Burn(
    projectId: String,
    by: Address, 
    currentCycle: UInt64?,
    tokenSymbol: String,
    amount: UFix64
  )
  access(all) event LockTokens(
    projectId: String,
    by: Address, 
    to: Address,
    currentCycle: UInt64?,
    tokenSymbol: String,
    amount: UFix64,
    unlockTime: UFix64
  )
  access(all) event StakeFlow(
    projectId: String,
    by: Address, 
    amountIn: UFix64,
    amountOut: UFix64
  )
  access(all) event UnstakeFlow(
    projectId: String,
    by: Address, 
    amountIn: UFix64,
    amountOut: UFix64
  )
  access(all) event AddSigner(projectId: String, signer: Address)
  access(all) event RemoveSigner(projectId: String, signer: Address)
  access(all) event UpdateThreshold(projectId: String, newThreshold: UInt64)

  access(all) struct CycleTimeFrame {
    access(all) let startTime: UFix64
    access(all) let endTime: UFix64?

    init(_ st: UFix64, _ et: UFix64?) {
      pre {
        et == nil || (et! > st): "The end time must be greater than the start time."
      }
      self.startTime = st
      self.endTime = et
    }
  }

  access(all) struct Payout {
    access(all) let address: Address
    access(all) let percent: UFix64

    init(_ a: Address, _ p: UFix64) {
      pre {
        p > 0.0 && p < 1.0: "percent must be a percantage."
      }
      self.address = a
      self.percent = p
    }
  }

  access(all) struct FundingCycleDetails {
    access(all) let cycleId: UInt64
    // nil if the funding target is infinity
    access(all) let fundingTarget: UFix64?
    access(all) let issuanceRate: UFix64
    // a tax on purchases
    access(all) let reserveRate: UFix64
    access(all) let timeframe: CycleTimeFrame
    access(all) let payouts: [Payout]
    access(all) let allowOverflow: Bool
    access(all) let allowedAddresses: [Address]?
    access(all) let catalogCollectionIdentifier: String?
    access(all) let extra: {String: AnyStruct}

    init(cycleId: UInt64, fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeframe: CycleTimeFrame, payouts: [Payout], allowOverflow: Bool, allowedAddresses: [Address]?, catalogCollectionIdentifier: String?, _ extra: {String: AnyStruct}) {
      pre {
        reserveRate <= 1.0: "You must provide a reserve rate value between 0.0 and 1.0"
      }
      self.cycleId = cycleId
      self.issuanceRate = issuanceRate
      self.fundingTarget = fundingTarget
      self.reserveRate = reserveRate
      self.timeframe = timeframe
      self.allowOverflow = allowOverflow
      self.allowedAddresses = allowedAddresses
      self.catalogCollectionIdentifier = catalogCollectionIdentifier
      self.extra = extra
      self.payouts = payouts

      var percentCount: UFix64 = 0.0
      for payout in self.payouts {
        percentCount = percentCount + payout.percent
      }
      assert(percentCount <= 1.0, message: "Payouts cannot total to more than 100%.")
    }
  }

  access(all) struct FundingCycle {
    access(all) var details: FundingCycleDetails
    // the amount of tokens that users acquired during
    // this round (does not count the amount that got
    // reserved to treasury)
    access(all) var projectTokensAcquired: UFix64
    // This is the amount of payment received during the round.
    // This does NOT include Overflow that was transferred into this
    // round.
    access(all) var raisedDuringRound: UFix64
    // Same as raisedDuringRound but
    // also includes overflow transferred in
    access(all) var raisedTowardsGoal: UFix64
    access(all) let funders: {Address: UFix64}
 
    // called when a purchase happens
    access(contract) fun handlePaymentReceipt(projectTokensAcquired: UFix64, cost: UFix64, payer: Address) {
      self.projectTokensAcquired = self.projectTokensAcquired + projectTokensAcquired
      self.funders[payer] = (self.funders[payer] ?? 0.0) + cost
      self.raisedDuringRound = self.raisedDuringRound + cost
      self.raisedTowardsGoal = self.raisedTowardsGoal + cost
    }

    // for overflow purposes
    access(contract) fun raise(amount: UFix64) {
      self.raisedTowardsGoal = self.raisedTowardsGoal + amount
    }

    access(contract) fun changeDetails(newDetails: FundingCycleDetails) {
      self.details = newDetails
    }

    init(details: FundingCycleDetails) {
      self.details = details
      self.projectTokensAcquired = 0.0
      self.raisedTowardsGoal = 0.0
      self.funders = {}
      self.raisedDuringRound = 0.0
    }
  }

  access(all) resource Project {
    access(all) let projectId: String
    access(all) var projectTokenInfo: ToucansTokens.TokenInfo
    access(all) let paymentTokenInfo: ToucansTokens.TokenInfo
    // Of payment tokens
    access(all) var totalFunding: UFix64
    // You cannot edit or start a new cycle within this time frame
    access(all) var editDelay: UFix64
    access(all) let minting: Bool
    access(all) var purchasing: Bool
    access(all) var nextCycleId: UInt64

    // Kept in order of start date
    // i.e. every element in the array
    // must have a start time greater
    // than the one before it
    access(self) let fundingCycles: [FundingCycle]
    access(self) let treasury: @{Type: {FungibleToken.Vault}}
    access(self) let multiSignManager: @Manager
    access(self) let overflow: @{FungibleToken.Vault}
    access(self) var minter: @{Minter}
    access(self) let funders: {Address: UFix64}
    access(self) var extra: {String: AnyStruct}
    access(self) var additions: @{String: AnyResource}

    // This function will be called when the owner is ready to add their own token to the DAO.  
    //
    // This function is useless if the project owner already configured a token when they
    // created the project.
    // 
    // COMING SOON
    //
    // access(all) fun evolve(projectTokenInfo: ToucansTokens.TokenInfo, minter: @{Minter}, initialTreasurySupply: UFix64, editDelay: UFix64) {
    //   pre {
    //     !self.hasTokenContract(): "This project already has an associated token."
    //   }
    //   self.editDelay = editDelay
    //   self.projectTokenInfo = projectTokenInfo
    //   let initialVault: @FungibleToken.Vault <- minter.mint(amount: initialTreasurySupply)
    //   assert(initialVault.getType() == projectTokenInfo.tokenType, message: "The passed in minter did not mint the correct token type.")
    //   self.depositToTreasury(vault: <- initialVault)
    //   let dummyMinter <- self.minter <- minter
    //   destroy dummyMinter
    // }


    //  __  __       _ _   _    _____ _             
    // |  \/  |     | | | (_)  / ____(_)            
    // | \  / |_   _| | |_ _  | (___  _  __ _ _ __  
    // | |\/| | | | | | __| |  \___ \| |/ _` | '_ \ 
    // | |  | | |_| | | |_| |  ____) | | (_| | | | |
    // |_|  |_|\__,_|_|\__|_| |_____/|_|\__, |_| |_|
    //                                   __/ |      
    //                                  |___/       


    access(all) fun proposeWithdraw(vaultType: Type, recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
      let tokenInfo = self.getTokenInfo(inputVaultType: vaultType) 
                ?? panic("Unsupported token type for withdrawing.")
      let action = ToucansActions.WithdrawToken(vaultType, recipientVault, amount, tokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeBatchWithdraw(vaultType: Type, recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}, amounts: {Address: UFix64}) {
      let tokenInfo = self.getTokenInfo(inputVaultType: vaultType) 
                ?? panic("Unsupported token type for withdrawing.")
      let action = ToucansActions.BatchWithdrawToken(vaultType, recipientVaults, amounts, tokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeWithdrawNFTs(collectionType: Type, recipientCollection: Capability<&{NonFungibleToken.Receiver}>, nftIDs: [UInt64], message: String, _ recipientCollectionBackup: Capability<&{NonFungibleToken.CollectionPublic}>) {
      let specificNFTTreasury = self.borrowSpecificNFTTreasuryCollection(type: collectionType)
                        ?? panic("This collection type does not exist in the NFT Treasury.")
      let existingIDs: [UInt64] = specificNFTTreasury.getIDs()
      for id in nftIDs {
        assert(existingIDs.contains(id), message: "The NFT ID ".concat(id.toString()).concat(" does not exist in the NFT Treasury."))
      }
      
      let action = ToucansActions.WithdrawNFTs(collectionType, nftIDs, recipientCollection, recipientCollectionBackup, message)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeMint(recipientVault: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
      pre {
        recipientVault.borrow()!.getType() == self.projectTokenInfo.tokenType: 
          "This vault cannot receive the projects token."
        self.minting: "Minting is turned off."
        self.hasTokenContract(): "There is no token to mint."
      }
      let action = ToucansActions.MintTokens(recipientVault, amount, self.projectTokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeBurn(tokenType: Type, amount: UFix64) {
      let tokenInfo = self.getTokenInfo(inputVaultType: tokenType) 
                ?? panic("Unsupported token type for burning.")
      let action = ToucansActions.BurnTokens(amount, tokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeBatchMint(recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}, amounts: {Address: UFix64}) {
      pre {
        self.minting: "Minting is turned off."
        self.hasTokenContract(): "There is no token to mint."
      }
      let action = ToucansActions.BatchMintTokens(recipientVaults, amounts, self.projectTokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeMintToTreasury(amount: UFix64) {
      pre {
        self.minting: "Minting is turned off."
        self.hasTokenContract(): "There is no token to mint."
      }
      let action = ToucansActions.MintTokensToTreasury(amount, self.projectTokenInfo.symbol)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeAddSigner(signer: Address) {
      pre {
        !self.multiSignManager.getSigners().contains(signer): "This wallet is already a signer."
      }
      let action = ToucansActions.AddOneSigner(signer)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeRemoveSigner(signer: Address) {
      pre {
        self.multiSignManager.getSigners().length > 1: "Cannot remove a signer if it will bring the signers to 0."
        self.multiSignManager.getSigners().contains(signer): "This wallet is not already a signer."
      }
      let action = ToucansActions.RemoveOneSigner(signer)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeUpdateThreshold(threshold: UInt64) {
      pre {
        self.multiSignManager.getSigners().length >= Int(threshold): "Threshold cannot be above number of signers."
        threshold > 0: "Threshold must be greater than 0."
      }
      let action = ToucansActions.UpdateTreasuryThreshold(threshold)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeLockTokens(recipient: Address, tokenType: Type, amount: UFix64, unlockTime: UFix64) {
      let tokenInfo = self.getTokenInfo(inputVaultType: tokenType) 
                ?? panic("Unsupported token type for locking tokens.")
      let action = ToucansActions.LockTokens(recipient, amount, tokenInfo.symbol, unlockTime)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeStakeFlow(flowAmount: UFix64, stFlowAmountOutMin: UFix64) {
      let action = ToucansActions.StakeFlow(flowAmount, stFlowAmountOutMin)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun proposeUnstakeFlow(stFlowAmount: UFix64, flowAmountOutMin: UFix64) {
      let action = ToucansActions.UnstakeFlow(stFlowAmount, flowAmountOutMin)
      self.multiSignManager.createMultiSign(action: action)
    }

    access(all) fun finalizeAction(actionUUID: UInt64) {
      let actionState: ActionState = self.multiSignManager.getActionState(actionUUID: actionUUID)
      assert(actionState == ActionState.ACCEPTED || actionState == ActionState.DECLINED, message: "Cannot finalize this action yet.")
      
      if actionState == ActionState.ACCEPTED {
        self.markCompletedAction(actionUUID: actionUUID, mark: true)
        let actionWrapper: &MultiSignAction = self.multiSignManager.borrowAction(actionUUID: actionUUID)
        let action: &{ToucansActions.Action} = actionWrapper.action
        switch action.getType() {
          case Type<ToucansActions.WithdrawToken>():
            let withdraw: ToucansActions.WithdrawToken = action as! ToucansActions.WithdrawToken
            let recipientVault: &{FungibleToken.Receiver} = withdraw.recipientVault.borrow()!
            self.withdrawFromTreasury(vaultType: withdraw.vaultType, vault: recipientVault, amount: withdraw.amount, tokenSymbol: withdraw.tokenSymbol)
          case Type<ToucansActions.BatchWithdrawToken>():
            let withdraw: ToucansActions.BatchWithdrawToken = action as! ToucansActions.BatchWithdrawToken
            self.batchWithdrawFromTreasury(vaultType: withdraw.vaultType, vaults: withdraw.recipientVaults, amounts: withdraw.amounts, tokenSymbol: withdraw.tokenSymbol)
          case Type<ToucansActions.WithdrawNFTs>():
            let withdraw: ToucansActions.WithdrawNFTs = action as! ToucansActions.WithdrawNFTs
            let recipientAddr: Address = withdraw.recipientCollection.address
            var backupReceiver: &{NonFungibleToken.CollectionPublic}? = nil
            if withdraw.extra["backupReceiver"] != nil {
              backupReceiver = (withdraw.extra["backupReceiver"]! as! Capability<&{NonFungibleToken.CollectionPublic}>).borrow()
            }
            let message: String = withdraw.extra["message"] == nil ? "" : withdraw.extra["message"]! as! String
            self.withdrawNFTsFromTreasury(
              collectionType: withdraw.collectionType, 
              collectionReceiver: withdraw.recipientCollection.borrow(), 
              nftIDs: withdraw.nftIDs, 
              collectionIdentifier: withdraw.collectionIdentifier, 
              collectionName: withdraw.collectionName, 
              collectionExternalURL: withdraw.collectionExternalURL,
              recipientAddr: recipientAddr,
              message: message,
              backupReceiver
            )
          case Type<ToucansActions.MintTokens>():
            let mint: ToucansActions.MintTokens = action as! ToucansActions.MintTokens
            self.mint(recipientVault: mint.recipientVault.borrow()!, amount: mint.amount)
          case Type<ToucansActions.BatchMintTokens>():
            let mint: ToucansActions.BatchMintTokens = action as! ToucansActions.BatchMintTokens
            self.batchMint(vaults: mint.recipientVaults, amounts: mint.amounts)
          case Type<ToucansActions.BurnTokens>():
            let burn: ToucansActions.BurnTokens = action as! ToucansActions.BurnTokens
            if burn.tokenSymbol == self.projectTokenInfo.symbol {
              self.burn(tokenType: self.projectTokenInfo.tokenType, tokenSymbol: burn.tokenSymbol, amount: burn.amount)
            } else {
              self.burn(tokenType: ToucansTokens.getTokenInfoFromSymbol(symbol: burn.tokenSymbol)!.tokenType, tokenSymbol: burn.tokenSymbol, amount: burn.amount)
            }
          case Type<ToucansActions.MintTokensToTreasury>():
            let mint: ToucansActions.MintTokensToTreasury = action as! ToucansActions.MintTokensToTreasury
            let ref: &{FungibleToken.Vault} = (&self.treasury[self.projectTokenInfo.tokenType] as &{FungibleToken.Vault}?)!
            self.mint(recipientVault: ref, amount: mint.amount)
          case Type<ToucansActions.AddOneSigner>():
            let addSigner: ToucansActions.AddOneSigner = action as! ToucansActions.AddOneSigner
            self.multiSignManager.addSigner(signer: addSigner.signer)
            emit AddSigner(projectId: self.projectId, signer: addSigner.signer)
          case Type<ToucansActions.RemoveOneSigner>():
            let removeSigner: ToucansActions.RemoveOneSigner = action as! ToucansActions.RemoveOneSigner
            self.multiSignManager.removeSigner(signer: removeSigner.signer)
            emit RemoveSigner(projectId: self.projectId, signer: removeSigner.signer)
          case Type<ToucansActions.UpdateTreasuryThreshold>():
            let updateThreshold: ToucansActions.UpdateTreasuryThreshold = action as! ToucansActions.UpdateTreasuryThreshold
            self.multiSignManager.updateThreshold(newThreshold: updateThreshold.threshold)
            emit UpdateThreshold(projectId: self.projectId, newThreshold: updateThreshold.threshold)
          case Type<ToucansActions.LockTokens>():
            let tokenLock: ToucansActions.LockTokens = action as! ToucansActions.LockTokens
            if tokenLock.tokenSymbol == self.projectTokenInfo.symbol {
              self.sendToLock(recipient: tokenLock.recipient, tokenInfo: self.projectTokenInfo, amount: tokenLock.amount, unlockTime: tokenLock.unlockTime)
            } else {
              self.sendToLock(recipient: tokenLock.recipient, tokenInfo: ToucansTokens.getTokenInfoFromSymbol(symbol: tokenLock.tokenSymbol)!, amount: tokenLock.amount, unlockTime: tokenLock.unlockTime)
            }
          case Type<ToucansActions.StakeFlow>():
            let tokenLock: ToucansActions.StakeFlow = action as! ToucansActions.StakeFlow
            self.stakeFlow(flowAmount: tokenLock.flowAmount, stFlowAmountOutMin: tokenLock.stFlowAmountOutMin)
          case Type<ToucansActions.UnstakeFlow>():
            let tokenLock: ToucansActions.UnstakeFlow = action as! ToucansActions.UnstakeFlow
            self.unstakeFlow(stFlowAmount: tokenLock.stFlowAmount, flowAmountOutMin: tokenLock.flowAmountOutMin)
        }
      }
      if actionState == ActionState.DECLINED {
        self.markCompletedAction(actionUUID: actionUUID, mark: false)
      }

      // Will delete the action and make sure everything is good to go
      self.multiSignManager.destroyAction(actionUUID: actionUUID)
    }


    //   ______               _           _          
    //  |  ____|             | |         (_)         
    //  | |__ _   _ _ __   __| |_ __ __ _ _ ___  ___ 
    //  |  __| | | | '_ \ / _` | '__/ _` | / __|/ _ \
    //  | |  | |_| | | | | (_| | | | (_| | \__ \  __/
    //  |_|   \__,_|_| |_|\__,_|_|  \__,_|_|___/\___|
                                                         

    // Allows you to add a new funding round to the end of the array.
    // This does not allow you to insert a funding round into the middle
    // somewhere. Maybe we will allow this later.
    // NOTES:
    // If `fundingTarget` is nil, that means this is an on-going funding round,
    // and there is no limit. 
    access(ProjectOwner) fun configureFundingCycle(fundingTarget: UFix64?, issuanceRate: UFix64, reserveRate: UFix64, timeframe: CycleTimeFrame, payouts: [Payout], allowOverflow: Bool, allowedAddresses: [Address]?, catalogCollectionIdentifier: String?, extra: {String: AnyStruct}) {
      pre {
        getCurrentBlock().timestamp + self.editDelay <= timeframe.startTime: "You cannot configure a new cycle to start within the edit delay."
        timeframe.startTime >= getCurrentBlock().timestamp: "Start time must be now or in the future."
        self.hasTokenContract(): "There is no token to mint."
      }

      let newFundingCycle: FundingCycle = FundingCycle(details: FundingCycleDetails(
        cycleId: self.nextCycleId,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        timeframe: timeframe,
        payouts: payouts,
        allowOverflow: allowOverflow,
        allowedAddresses: allowedAddresses,
        catalogCollectionIdentifier: catalogCollectionIdentifier,
        extra
      ))

      var i: Int = self.fundingCycles.length - 1
      var insertAt: Int = 0
      while i >= 0 {
        let cycle: FundingCycle = self.fundingCycles[i]
        if timeframe.startTime >= cycle.details.timeframe.startTime {
          insertAt = i + 1
          break
        }
        i = i - 1
      }

      self.fundingCycles.insert(at: insertAt, newFundingCycle)

      // Make sure it doesn't conflict with a cycle before it
      if insertAt > 0 {
        let previousCycle: FundingCycle = self.getFundingCycle(cycleIndex: UInt64(insertAt - 1))
        Toucans.assertNonConflictingCycles(earlierCycle: previousCycle.details, laterCycle: newFundingCycle.details)
      }
 
      // Make sure it doesn't conflict with a cycle after it
      if insertAt < self.fundingCycles.length - 1 {
        let subsequentCycle: FundingCycle = self.getFundingCycle(cycleIndex: UInt64(insertAt + 1))
        Toucans.assertNonConflictingCycles(earlierCycle: newFundingCycle.details, laterCycle: subsequentCycle.details)
      }

      emit NewFundingCycle(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        newCycleId: self.nextCycleId,
        fundingTarget: fundingTarget,
        issuanceRate: issuanceRate,
        reserveRate: reserveRate,
        timeframe: timeframe
      )
      self.nextCycleId = self.nextCycleId + 1
    }

    // Allows you to edit a cycle that has not happened yet
    access(ProjectOwner) fun editUpcomingCycle(cycleIndex: UInt64, details: FundingCycleDetails) {
      let fundingCycle: &FundingCycle = self.borrowFundingCycleRef(cycleIndex: cycleIndex)
      let currentTime: UFix64 = getCurrentBlock().timestamp
      assert(fundingCycle.details.cycleId == details.cycleId, message: "Cannot edit the cycleId.")
      assert(
        self.editDelay == 0.0 || (currentTime + self.editDelay <= details.timeframe.startTime),
        message: "You are no longer allowed to edit this upcoming cycle because of your edit delay." 
      )
      assert(
        fundingCycle.details.timeframe.startTime == details.timeframe.startTime || 
        currentTime <= fundingCycle.details.timeframe.startTime,
        message: "You can only change the start time if the round hasn't started yet."
      )
      assert(
        fundingCycle.details.timeframe.startTime == details.timeframe.startTime ||
        currentTime <= details.timeframe.startTime,
        message: "New start time must be greater than now."
      )

      // Check the cycle above it, if it exists
      if Int(cycleIndex) < self.fundingCycles.length - 1 {
        let aboveCycle: FundingCycle = self.getFundingCycle(cycleIndex: cycleIndex + 1)
        Toucans.assertNonConflictingCycles(earlierCycle: details, laterCycle: aboveCycle.details)
      }

      // Check the cycle below it, if it exists
      if cycleIndex > 0 {
        let belowCycle: FundingCycle = self.getFundingCycle(cycleIndex: cycleIndex - 1)
        Toucans.assertNonConflictingCycles(earlierCycle: belowCycle.details, laterCycle: details)
      }

      fundingCycle.changeDetails(newDetails: details)
    }

    access(ProjectOwner) fun togglePurchasing() {
      self.purchasing = !self.purchasing
    }

    access(all) fun purchase(paymentTokens: @{FungibleToken.Vault}, projectTokenReceiver: &{FungibleToken.Receiver}, message: String) {
      pre {
        paymentTokens.getType() == self.paymentTokenInfo.tokenType: "This is not the correct payment."
        self.purchasing: "Purchasing is turned off at the moment."
        self.hasTokenContract(): "There is no token to purchase."
      }
      let fundingCycleRef: &FundingCycle = self.borrowCurrentFundingCycleRef() ?? panic("There is no active cycle.")

      // tax for emerald city (2%)
      let emeraldCityTreasury = getAccount(0x5643fd47a29770e7).capabilities.borrow<&{FungibleToken.Receiver}>(self.paymentTokenInfo.receiverPath)
                                          ?? panic("Emerald City treasury cannot accept this payment. Please contact us in our Discord.")
      emeraldCityTreasury.deposit(from: <- paymentTokens.withdraw(amount: paymentTokens.balance * 0.02))
      
      let paymentAfterTax: UFix64 = paymentTokens.balance
      let payer: Address = projectTokenReceiver.owner!.address

      // If there is a limit on allowed addresses, check that here.
      if let allowedAddresses: &[Address] = fundingCycleRef.details.allowedAddresses {
        assert(
          allowedAddresses.contains(payer),
          message: "This account is not allowed to participate in this round."
        )
      }

      // If the payer must have a certain NFT, check that here.
      if let catalogCollectionIdentifier: String = fundingCycleRef.details.catalogCollectionIdentifier {
        assert(
          ToucansUtils.ownsNFTFromCatalogCollectionIdentifier(collectionIdentifier: catalogCollectionIdentifier, user: payer),
          message: "User does not own a requried NFT for participating in the round."
        )
      }
 
      let issuanceRate: UFix64 = self.getCurrentIssuanceRate()!
      let amountToMint: UFix64 = issuanceRate * paymentAfterTax
      let mintedTokens: @{FungibleToken.Vault} <- self.minter.mint(amount: amountToMint)
      assert(mintedTokens.getType() == self.projectTokenInfo.tokenType, message: "Someone is messing with the minter. It's not minting the original type.")
      assert(amountToMint == mintedTokens.balance, message: "Not enough tokens were minted.")

      // RESERVE RATE: Withhold some of the purchased tokens
      let reserved: @{FungibleToken.Vault} <- mintedTokens.withdraw(amount: mintedTokens.balance * fundingCycleRef.details.reserveRate)
      // Deposit tax to project treasury
      self.depositToTreasury(vault: <- reserved)

      // 2 cases:
      // 1. Funding target is nil OR amount sent won't exceed the target (deposit everything to treasury)
      // 2. Amount sent will make us overflow the goal or it has already been reached (split between overflow and treasury)
      let fundingTarget: UFix64? = fundingCycleRef.details.fundingTarget
      if fundingTarget == nil || (fundingCycleRef.raisedTowardsGoal + paymentAfterTax <= fundingTarget!) {
        // Calculate payouts
        for payout in fundingCycleRef.details.payouts {
          ToucansUtils.depositTokensToAccount(funds: <- paymentTokens.withdraw(amount: paymentAfterTax * payout.percent), to: payout.address, publicPath: self.paymentTokenInfo.receiverPath)
        } 
        self.depositToTreasury(vault: <- paymentTokens)
      } else {
        // "Fail fast"
        assert(fundingCycleRef.details.allowOverflow, message: "Overflow is not allowed. Cannot purchase.")
        if fundingCycleRef.raisedTowardsGoal < fundingTarget! {
          // this is the amount that will put the current round at its goal
          var amountToGoal: UFix64 = fundingTarget! - fundingCycleRef.raisedTowardsGoal
          // calculate payouts 
          for payout in fundingCycleRef.details.payouts {
            let amountToPayout: UFix64 = amountToGoal * payout.percent
            ToucansUtils.depositTokensToAccount(funds: <- paymentTokens.withdraw(amount: amountToPayout), to: payout.address, publicPath: self.paymentTokenInfo.receiverPath)
            amountToGoal = amountToGoal - amountToPayout
          } 
          // put the rest in treasury
          self.depositToTreasury(vault: <- paymentTokens.withdraw(amount: amountToGoal))
        }

        // Give the rest to overflow
        self.depositToOverflow(vault: <- paymentTokens)
      }
  
      // Tokens were purchased, so increment amount raised
      self.totalFunding = self.totalFunding + paymentAfterTax
      self.funders[payer] = (self.funders[payer] ?? 0.0) + paymentAfterTax
      // Amount acquired by user is the amount minted - the reserve tax
      fundingCycleRef.handlePaymentReceipt(projectTokensAcquired: mintedTokens.balance, cost: paymentAfterTax, payer: payer)
      // Deposit new tokens to payer
      projectTokenReceiver.deposit(from: <- mintedTokens)
      emit Purchase(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: fundingCycleRef.details.cycleId,
        tokenSymbol: self.paymentTokenInfo.symbol,
        amount: paymentAfterTax,
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


    access(self) fun depositToTreasury(vault: @{FungibleToken.Vault}) {
      if let existingVault = &self.treasury[vault.getType()] as &{FungibleToken.Vault}? {
        existingVault.deposit(from: <- vault)
      } else {
        self.treasury[vault.getType()] <-! vault
      }
    }

    access(self) fun depositToOverflow(vault: @{FungibleToken.Vault}) {
      pre {
        vault.getType() == self.paymentTokenInfo.tokenType: "Not payment token type."
      }
      self.overflow.deposit(from: <- vault)
    }

    access(account) fun borrowManager(): &Manager {
      return &self.multiSignManager as &Manager
    }

    access(all) view fun getTokenInfo(inputVaultType: Type): ToucansTokens.TokenInfo? {
      if inputVaultType == self.projectTokenInfo.tokenType {
        return self.projectTokenInfo
      } else if let tokenInfo = ToucansTokens.getTokenInfo(tokenType: inputVaultType) {
        return tokenInfo
      }
      return nil
    }

    access(self) fun withdrawFromTreasury(vaultType: Type, vault: &{FungibleToken.Receiver}, amount: UFix64, tokenSymbol: String) {
      emit Withdraw(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: tokenSymbol,
        amount: amount,
        to: vault.owner!.address
      )
      vault.deposit(from: <- self.treasury[vaultType]?.withdraw!(amount: amount))
    }

    access(self) fun batchWithdrawFromTreasury(vaultType: Type, vaults: {Address: Capability<&{FungibleToken.Receiver}>}, amounts: {Address: UFix64}, tokenSymbol: String) {
      let failed: [Address] = []
      var totalAmount: UFix64 = 0.0
      for wallet in amounts.keys {
        let amount: UFix64 = amounts[wallet]!
        totalAmount = totalAmount + amount
        if let recipientVault: &{FungibleToken.Receiver} = vaults[wallet]!.borrow() {
          recipientVault.deposit(from: <- self.treasury[vaultType]?.withdraw!(amount: amount))
        } else {
          failed.append(wallet)
        }
      }
      emit BatchWithdraw(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: tokenSymbol,
        amounts: amounts,
        amount: totalAmount,
        failed: failed
      )
    }

    access(all) fun donateToTreasury(vault: @{FungibleToken.Vault}, payer: Address, message: String) {
      let tokenInfo = self.getTokenInfo(inputVaultType: vault.getType())
                ?? panic("Unsupported token type for donating.")

      // remove tax on donations for the time being
      //
      // let emeraldCityTreasury = getAccount(0x5643fd47a29770e7).getCapability(tokenInfo.receiverPath)
      //                                     .borrow<&{FungibleToken.Receiver}>()
      //                                     ?? panic("Emerald City treasury cannot accept this payment. Please contact us in our Discord.")
      // emeraldCityTreasury.deposit(from: <- vault.withdraw(amount: vault.balance * 0.05))

      emit Donate(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
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

    access(all) fun transferProjectTokenToTreasury(vault: @{FungibleToken.Vault}, payer: Address, message: String) {
      pre {
        vault.getType() == self.projectTokenInfo.tokenType: "The received vault is not the project's token type."
        self.hasTokenContract(): "There is no project token."
      }
      emit Donate(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        amount: vault.balance,
        tokenSymbol: self.projectTokenInfo.symbol,
        by: payer,
        message: message
      )
      self.depositToTreasury(vault: <- vault)
    }

    access(self) fun markCompletedAction(actionUUID: UInt64, mark: Bool) {
      if self.extra["completedActionIds"] == nil {
        self.extra["completedActionIds"] = {} as {UInt64: Bool}
      }

      (self.extra["completedActionIds"]! as! {UInt64: Bool}).insert(key: actionUUID, mark)
    }

    access(ProjectOwner) fun addAllowedNFTCollections(collectionIdentifiers: [String]) {
      if self.extra["allowedNFTCollections"] == nil {
        self.extra["allowedNFTCollections"] = {} as {String: Bool}
      }

      for collectionIdentifier in collectionIdentifiers {
        (self.extra["allowedNFTCollections"]! as! {String: Bool}).insert(key: collectionIdentifier, true)
      }
    }

    access(ProjectOwner) fun removeAllowedNFTCollections(collectionIdentifiers: [String]) {      
      for collectionIdentifier in collectionIdentifiers {
        (self.extra["allowedNFTCollections"]! as! {String: Bool}).remove(key: collectionIdentifier)
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


    access(account) fun mint(recipientVault: &{FungibleToken.Receiver}, amount: UFix64) {
      pre {
        self.minting: "Minting is off. You cannot do this."
        self.hasTokenContract(): "There is no token to mint."
      }

      let tokens <- self.minter.mint(amount: amount)
      recipientVault.deposit(from: <- tokens)

      emit Mint(
        projectId: self.projectId,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: self.projectTokenInfo.symbol,
        to: recipientVault.owner!.address,
        amount: amount
      )
    }

    access(account) fun batchMint(vaults: {Address: Capability<&{FungibleToken.Receiver}>}, amounts: {Address: UFix64}) {
      pre {
        self.minting: "Minting is off. You cannot do this."
        self.hasTokenContract(): "There is no token to mint."
      }

      let failed: [Address] = []
      var totalAmount: UFix64 = 0.0
      for wallet in amounts.keys {
        let amount = amounts[wallet]!
        totalAmount = totalAmount + amount
        if let recipientVault: &{FungibleToken.Receiver} = vaults[wallet]!.borrow() {
           let tokens <- self.minter.mint(amount: amount)
           recipientVault.deposit(from: <- tokens)
           continue
        }
        failed.append(wallet)
      }
      emit BatchMint(
        projectId: self.projectId,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: self.projectTokenInfo.symbol,
        amounts: amounts,
        amount: totalAmount,
        failed: failed
      )
    }


    //   _   _ ______ _______ 
    //  | \ | |  ____|__   __|
    //  |  \| | |__     | |   
    //  | . ` |  __|    | |   
    //  | |\  | |       | |   
    //  |_| \_|_|       |_|   
                                   

    access(all) fun donateNFTToTreasury(collection: @{NonFungibleToken.Collection}, sender: Address, message: String) {
      // make sure this DAO accepts this nft type
      let nftCatalogCollectionIdentifier = ToucansUtils.getNFTCatalogCollectionIdentifierFromCollectionIdentifier(collectionIdentifier: collection.getType().identifier)
      let nftCatalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: nftCatalogCollectionIdentifier)!
      assert(self.getAllowedNFTCollections().contains(nftCatalogCollectionIdentifier), message: "This DAO does not accept this NFT type.")

      if self.additions["nftTreasury"] == nil {
        self.additions["nftTreasury"] <-! ({} as @{Type: {NonFungibleToken.Collection}})
      }
      let nftTreasury = self.borrowNFTTreasury()!

      if nftTreasury[collection.getType()] == nil {
        // CHECK THIS!!!!!!!!!!!!
        nftTreasury[collection.getType()] <-! collection.createEmptyCollection()
      }
      let specificNFTTreasury = self.borrowSpecificNFTTreasuryCollection(type: collection.getType())!

      let donatedUUIDs: [UInt64] = []
      for id in collection.getIDs() {
        let nft <- collection.withdraw(withdrawID: id)
        donatedUUIDs.append(nft.uuid)
        specificNFTTreasury.deposit(token: <- nft)
      }
      assert(collection.getIDs().length == 0, message: "This collection is not empty.")
      destroy collection
      
      emit DonateNFT(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        amount: UInt64(donatedUUIDs.length),
        uuids: donatedUUIDs,
        collectionIdentifier: nftCatalogCollectionIdentifier,
        collectionName: nftCatalogEntry.collectionDisplay.name,
        collectionExternalURL: nftCatalogEntry.collectionDisplay.externalURL.url,
        by: sender,
        message: message
      )
    }

    access(self) fun withdrawNFTsFromTreasury(
      collectionType: Type, 
      collectionReceiver: &{NonFungibleToken.Receiver}?, 
      nftIDs: [UInt64], 
      collectionIdentifier: String, 
      collectionName: String, 
      collectionExternalURL: String, 
      recipientAddr: Address,
      message: String,
      _ backupReceiver: &{NonFungibleToken.CollectionPublic}?
    ) {
      emit WithdrawNFTs(
        projectId: self.projectId,
        projectOwner: self.owner!.address, 
        collectionIdentifier: collectionIdentifier,
        collectionName: collectionName,
        collectionExternalURL: collectionExternalURL,
        amount: UInt64(nftIDs.length),
        to: recipientAddr,
        message: message
      )
      let specificNFTTreasury = self.borrowSpecificNFTTreasuryCollection(type: collectionType)!
      // if main receiver available, use that
      if let receiver = collectionReceiver {
        for id in nftIDs {
          receiver.deposit(token: <- specificNFTTreasury.withdraw(withdrawID: id))
        }
      } else {
        log("using backuop")
        // otherwise use backup receiver
        for id in nftIDs {
          backupReceiver!.deposit(token: <- specificNFTTreasury.withdraw(withdrawID: id))
        }
      }
    }

    access(all) view fun getAllowedNFTCollections(): [String] {
      if let allowedNFTCollections = self.extra["allowedNFTCollections"] {
        return (allowedNFTCollections as! {String: Bool}).keys
      }
      return []
    }


    //   _______    _                _                _    
    //  |__   __|  | |              | |              | |   
    //     | | ___ | | _____ _ __   | |     ___   ___| | __
    //     | |/ _ \| |/ / _ \ '_ \  | |    / _ \ / __| |/ /
    //     | | (_) |   <  __/ | | | | |___| (_) | (__|   < 
    //     |_|\___/|_|\_\___|_| |_| |______\___/ \___|_|\_\
                                                                                           

    access(account) fun sendToLock(recipient: Address, tokenInfo: ToucansTokens.TokenInfo, amount: UFix64, unlockTime: UFix64) {
      if self.additions["lockedTokensManager"] == nil {
        self.additions["lockedTokensManager"] <-! ToucansLockTokens.createManager()
      }

      let tokenLockManager: auth(ToucansLockTokens.ManagerOwner) &ToucansLockTokens.Manager = self.borrowLockTokensManager()!
      let vaultToLock <- self.treasury[tokenInfo.tokenType]?.withdraw!(amount: amount)
      tokenLockManager.deposit(recipient: recipient, unlockTime: unlockTime, vault: <- vaultToLock, tokenInfo: tokenInfo)

      emit LockTokens(
        projectId: self.projectId,
        by: self.owner!.address, 
        to: recipient,
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: tokenInfo.symbol,
        amount: amount,
        unlockTime: unlockTime
      )
    }

    access(all) fun claimLockedTokens(lockedVaultUuid: UInt64, recipientVault: &{FungibleToken.Receiver}) {
      if self.additions["lockedTokensManager"] == nil {
        self.additions["lockedTokensManager"] <-! ToucansLockTokens.createManager()
      }

      let tokenLockManager: &ToucansLockTokens.Manager = self.borrowLockTokensManagerPublic()!
      tokenLockManager.claim(lockedVaultUuid: lockedVaultUuid, receiver: recipientVault)
    } 


    //   _____        __ _ 
    //  |  __ \      / _(_)
    //  | |  | | ___| |_ _ 
    //  | |  | |/ _ \  _| |
    //  | |__| |  __/ | | |
    //  |_____/ \___|_| |_|
                        
    
    // DISCLAIMER: Only works on Mainnet.
    access(account) fun stakeFlow(flowAmount: UFix64, stFlowAmountOutMin: UFix64) {
      // withdraw flow from treasury
      let inVault <- self.treasury[Type<@FlowToken.Vault>()]?.withdraw!(amount: flowAmount)
      // deposit stFlow to treasury
      let outVault: @stFlowToken.Vault <- ToucansUtils.swapTokensWithPotentialStake(inVault: <- inVault, tokenInKey: "A.1654653399040a61.FlowToken") as! @stFlowToken.Vault
      assert(outVault.balance >= stFlowAmountOutMin, message: SwapError.ErrorEncode(
        msg: "SLIPPAGE_OFFSET_TOO_LARGE expect min ".concat(stFlowAmountOutMin.toString()).concat(" got ").concat(outVault.balance.toString()),
        err: SwapError.ErrorCode.SLIPPAGE_OFFSET_TOO_LARGE
      ))
      emit StakeFlow(
        projectId: self.projectId,
        by: self.owner!.address,
        amountIn: flowAmount,
        amountOut: outVault.balance
      )
      self.depositToTreasury(vault: <- outVault)
    }

    // DISCLAIMER: Only works on Mainnet.
    access(account) fun unstakeFlow(stFlowAmount: UFix64, flowAmountOutMin: UFix64) {
      // withdraw stFlow from treasury
      let inVault <- self.treasury[Type<@stFlowToken.Vault>()]?.withdraw!(amount: stFlowAmount)
      // deposit flow to treasury
      let outVault: @FlowToken.Vault <- ToucansUtils.swapTokensWithPotentialStake(inVault: <- inVault, tokenInKey: "A.d6f80565193ad727.stFlowToken") as! @FlowToken.Vault
      assert(outVault.balance >= flowAmountOutMin, message: SwapError.ErrorEncode(
        msg: "SLIPPAGE_OFFSET_TOO_LARGE expect min ".concat(flowAmountOutMin.toString()).concat(" got ").concat(outVault.balance.toString()),
        err: SwapError.ErrorCode.SLIPPAGE_OFFSET_TOO_LARGE
      ))
      emit UnstakeFlow(
        projectId: self.projectId,
        by: self.owner!.address,
        amountIn: stFlowAmount,
        amountOut: outVault.balance
      )
      self.depositToTreasury(vault: <- outVault)
    }


    //   ____                   
    //  |  _ \                  
    //  | |_) |_   _ _ __ _ __  
    //  |  _ <| | | | '__| '_ \ 
    //  | |_) | |_| | |  | | | |
    //  |____/ \__,_|_|  |_| |_|
                         

    access(account) fun burn(tokenType: Type, tokenSymbol: String, amount: UFix64) {
      let tokens <- self.treasury[tokenType]?.withdraw!(amount: amount)
      Burner.burn(<- tokens)

      emit Burn(
        projectId: self.projectId,
        by: self.owner!.address, 
        currentCycle: self.getCurrentFundingCycleId(),
        tokenSymbol: tokenSymbol,
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
    access(ProjectOwner) fun transferOverflowToCurrentRound(amount: UFix64) {
      let cycle = self.borrowCurrentFundingCycleRef() ?? panic("There must be an active funding cycle in order to do this.")
      let overflow <- self.overflow.withdraw(amount: amount)
      // will fail if this puts the cycle over the funding target
      cycle.raise(amount: amount)
      self.depositToTreasury(vault: <- overflow)

      assert(
        cycle.details.fundingTarget == nil || (cycle.raisedTowardsGoal <= cycle.details.fundingTarget!),
        message: "Transferred Overflow cannot put the current funding round over its goal."
      )
    }

    // access(all) fun claimOverflow(tokenVault: @{FungibleToken.Vault}, receiver: &{FungibleToken.Receiver}) {
    //   pre {
    //     tokenVault.getType() == self.projectTokenInfo.tokenType: "This is not the project's token."
    //   }
    //   let balance: UFix64 = tokenVault.balance
    //   let totalSupply: UFix64 = getAccount(self.projectTokenInfo.contractAddress).contracts.borrow<&{FungibleToken}>(name: self.projectTokenInfo.contractName)!.totalSupply
    //   let percent: UFix64 = balance / totalSupply
    //   assert(percent >= 0.0 && percent <= 1.0, message: "Percent must be a percent value.")

    //   let overflowBalance: UFix64 = self.getOverflowBalance()
      
    //   receiver.deposit(from: <- self.overflow.withdraw(amount: overflowBalance * percent))
    //   self.depositToTreasury(vault: <- tokenVault)
    // }


    //    _____      _   _                
    //   / ____|    | | | |               
    //  | |  __  ___| |_| |_ ___ _ __ ___ 
    //  | | |_ |/ _ \ __| __/ _ \ '__/ __|
    //  | |__| |  __/ |_| ||  __/ |  \__ \
    //   \_____|\___|\__|\__\___|_|  |___/
                                   
                                   
    access(all) view fun getProjectTokenInfo(): ToucansTokens.TokenInfo {
      return self.projectTokenInfo
    }

    access(all) view fun getVaultTypesInTreasury(): [Type] {
      return self.treasury.keys
    }

    // Returns nil if the requested type doesn't exist in the treasury
    access(all) view fun getVaultBalanceInTreasury(vaultType: Type): UFix64? {
      return self.treasury[vaultType]?.balance
    }

    access(all) fun getCollectionTypesInTreasury(): &[Type] {
      return self.borrowNFTTreasury()?.keys ?? &[]
    }

    access(all) fun getNFTRefs(collectionType: Type): [&{NonFungibleToken.NFT}] {
      let ans: [&{NonFungibleToken.NFT}] = []
      if let nftTreasury = self.borrowSpecificNFTTreasuryCollection(type: collectionType) {
        for id in nftTreasury.getIDs() {
          ans.append(nftTreasury.borrowNFT(id)!)
        }
      }
      return ans
    }

    access(all) fun getNFTRefsByIDs(collectionType: Type, ids: [UInt64]): [&{NonFungibleToken.NFT}] {
      let ans: [&{NonFungibleToken.NFT}] = []
      if let nftTreasury = self.borrowSpecificNFTTreasuryCollection(type: collectionType) {
        for id in ids {
          ans.append(nftTreasury.borrowNFT(id)!)
        }
      }
      return ans
    }

    access(all) fun getNFTIDs(collectionType: Type): [UInt64] {
      if let nftTreasury = self.borrowSpecificNFTTreasuryCollection(type: collectionType) {
        return nftTreasury.getIDs()
      }
      return []
    }

    access(all) view fun getCurrentFundingCycleIndex(): Int? {
      var i: Int = self.fundingCycles.length - 1
      let timestamp: UFix64 = getCurrentBlock().timestamp

      while i >= 0 {
        let cycle: FundingCycle = self.fundingCycles[i]
        // If at any time we're greater than the cycle we're inspecting's start
        // time, we will return something.
        if timestamp >= cycle.details.timeframe.startTime {
          if (cycle.details.timeframe.endTime == nil || timestamp <= cycle.details.timeframe.endTime!){
            // In this case, we're in the middle of the latest one
            return i
          } else {
            // In this case, we're past the latest one
            return nil
          }
        }
        i = i - 1
      }
      return nil
    }

    // Returns nil if there is no current round
    access(all) view fun getCurrentFundingCycle(): FundingCycle? {
      let index: Int? = self.getCurrentFundingCycleIndex()
      if index == nil {
        return nil
      }
      return self.fundingCycles[index!]
    }

    access(all) view fun getCurrentFundingCycleId(): UInt64? {
      let currentCycle = self.getCurrentFundingCycle()
      return currentCycle?.details?.cycleId
    }

    // Returns nil if there is no current round
    access(all) view fun getCurrentIssuanceRate(): UFix64? {
      return self.getCurrentFundingCycle()?.details?.issuanceRate
    }

    access(all) view fun getFundingCycle(cycleIndex: UInt64): FundingCycle {
      return self.fundingCycles[cycleIndex]
    }

    access(all) view fun getFundingCycles(): [FundingCycle] {
      return self.fundingCycles
    }

    access(all) view fun getExtra(): {String: AnyStruct} {
      return self.extra
    }

    access(all) view fun getCompletedActionIds(): {UInt64: Bool} {
      if self.extra["completedActionIds"] == nil {
        return {}
      }

      return self.extra["completedActionIds"]! as! {UInt64: Bool}
    }

    access(all) view fun getFunders(): {Address: UFix64} {
      return self.funders
    }

    access(all) view fun getOverflowBalance(): UFix64 {
      return self.overflow.balance
    }

    access(all) view fun hasTokenContract(): Bool {
      return self.minter.getType() != Type<@DummyMinter>()
    }


    //   ____                               
    //  |  _ \                              
    //  | |_) | ___  _ __ _ __ _____      __
    //  |  _ < / _ \| '__| '__/ _ \ \ /\ / /
    //  | |_) | (_) | |  | | | (_) \ V  V / 
    //  |____/ \___/|_|  |_|  \___/ \_/\_/  
                                                                

    access(self) fun borrowFundingCycleRef(cycleIndex: UInt64): &FundingCycle {
      return &self.fundingCycles[cycleIndex] as &FundingCycle
    }

    access(self) fun borrowCurrentFundingCycleRef(): &FundingCycle? {
      let index: Int? = self.getCurrentFundingCycleIndex()
      if index == nil {
        return nil
      }
      return &self.fundingCycles[index!] as &FundingCycle
    }

    access(all) fun borrowManagerPublic(): &Manager {
      return &self.multiSignManager as &Manager
    }

    access(self) fun borrowLockTokensManager(): auth(ToucansLockTokens.ManagerOwner) &ToucansLockTokens.Manager? {
      if let lockTokensManager = &self.additions["lockedTokensManager"] as auth(ToucansLockTokens.ManagerOwner) &AnyResource? {
        return lockTokensManager as! auth(ToucansLockTokens.ManagerOwner) &ToucansLockTokens.Manager
      }
      return nil
    }

    access(all) fun borrowLockTokensManagerPublic(): &ToucansLockTokens.Manager? {
      if let lockTokensManager = &self.additions["lockedTokensManager"] as &AnyResource? {
        return lockTokensManager as! &ToucansLockTokens.Manager
      }
      return nil
    }

    access(self) fun borrowNFTTreasury(): auth(Mutate, NonFungibleToken.Withdraw) &{Type: {NonFungibleToken.Collection}}? {
      if let nftTreasury = &self.additions["nftTreasury"] as auth(Mutate) &AnyResource? {
        return nftTreasury as! auth(Mutate, NonFungibleToken.Withdraw) &{Type: {NonFungibleToken.Collection}}
      }
      return nil
    }

    access(self) fun borrowSpecificNFTTreasuryCollection(type: Type): auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}? {
      if let nftTreasury = self.borrowNFTTreasury() {
        return nftTreasury[type] as! auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}?
      }
      return nil
    }

    init(
      projectId: String,
      projectTokenInfo: ToucansTokens.TokenInfo,
      paymentTokenInfo: ToucansTokens.TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      initialSigners: [Address],
      initialThreshold: UInt64,
      minting: Bool,
      initialTreasurySupply: UFix64,
      initialAllowedNFTCollections: [String],
      extra: {String: AnyStruct}
    ) {
      pre {
        ToucansTokens.getTokenInfo(tokenType: paymentTokenInfo.tokenType) != nil: "Unsupported token type for payment."
      }

      let paymentContract = getAccount(paymentTokenInfo.contractAddress).contracts.borrow<&{FungibleToken}>(name: paymentTokenInfo.contractName)!
      let emptyPaymentVault <- paymentContract.createEmptyVault(vaultType: paymentTokenInfo.tokenType)

      // no new token created
      if minter.getType() == Type<@DummyMinter>() {
        self.treasury <- {emptyPaymentVault.getType(): <- emptyPaymentVault}
      } else {
        let initialVault: @{FungibleToken.Vault} <- minter.mint(amount: initialTreasurySupply)
        assert(initialVault.getType() == projectTokenInfo.tokenType, message: "The passed in minter did not mint the correct token type.")
        self.treasury <- {projectTokenInfo.tokenType: <- initialVault, emptyPaymentVault.getType(): <- emptyPaymentVault}
      }
      let allowedNFTCollections: {String: Bool} = {}
      for allowedNFTCollection in initialAllowedNFTCollections {
        allowedNFTCollections[allowedNFTCollection] = true
      }
      self.projectId = projectId
      self.nextCycleId = 0
      self.totalFunding = 0.0
      self.extra = extra
      self.extra = {
        "completedActionIds": {} as {UInt64: Bool},
        "allowedNFTCollections": allowedNFTCollections
      }
      self.fundingCycles = []
      self.minter <- minter
      self.funders = {}
      self.editDelay = editDelay
      self.projectTokenInfo = projectTokenInfo
      self.paymentTokenInfo = paymentTokenInfo
      self.minting = minting
      self.purchasing = true
      self.additions <- {
        "lockedTokensManager": <- ToucansLockTokens.createManager(),
        "nftTreasury": <- ({} as @{Type: {NonFungibleToken.Collection}})
      }
      self.overflow <- paymentContract.createEmptyVault(vaultType: paymentTokenInfo.tokenType)
      self.multiSignManager <- create Manager(_initialSigners: initialSigners, _initialThreshold: initialThreshold)
    }
  }

  access(all) resource Collection {
    access(self) let projects: @{String: Project}

    access(CollectionOwner) fun createProjectNoToken(
      projectId: String,
      paymentTokenInfo: ToucansTokens.TokenInfo,
      initialAllowedNFTCollections: [String],
      extra: {String: AnyStruct}
    ) {
      let project: @Project <- create Project(
        projectId: projectId,
        projectTokenInfo: paymentTokenInfo, // use the payment token, or "preferred currency", for this 
        paymentTokenInfo: paymentTokenInfo, 
        minter: <- create DummyMinter(), 
        editDelay: 0.0, 
        initialSigners: [self.owner!.address], 
        initialThreshold: 1, 
        minting: false, 
        initialTreasurySupply: 0.0, 
        initialAllowedNFTCollections: initialAllowedNFTCollections,
        extra: extra
      )
      self.projects[projectId] <-! project

      emit ProjectCreated(
        projectId: projectId,
        tokenTypeIdentifier: nil,
        by: self.owner!.address
      )
    }

    access(CollectionOwner) fun createProject(
      projectTokenInfo: ToucansTokens.TokenInfo, 
      paymentTokenInfo: ToucansTokens.TokenInfo,
      minter: @{Minter},
      editDelay: UFix64,
      minting: Bool,
      initialTreasurySupply: UFix64,
      extra: {String: AnyStruct}
    ) {
      var initialAllowedNFTCollections: [String] = []
      if let ianc = extra["initialAllowedNFTCollections"] {
        initialAllowedNFTCollections = ianc as! [String]
      }
      let projectId: String = projectTokenInfo.contractName
      let project: @Project <- create Project(
        projectId: projectId, 
        projectTokenInfo: projectTokenInfo, 
        paymentTokenInfo: paymentTokenInfo, 
        minter: <- minter, 
        editDelay: editDelay, 
        initialSigners: [self.owner!.address], 
        initialThreshold: 1, 
        minting: minting, 
        initialTreasurySupply: initialTreasurySupply, 
        initialAllowedNFTCollections: initialAllowedNFTCollections,
        extra: extra
      )
      self.projects[projectId] <-! project

      emit ProjectCreated(
        projectId: projectId,
        tokenTypeIdentifier: projectTokenInfo.tokenType.identifier,
        by: self.owner!.address
      )
    }

    access(all) fun borrowProjectPublic(projectId: String): &Project? {
      return &self.projects[projectId] as &Project?
    }

    access(all) view fun getProjectIds(): [String] {
      return self.projects.keys
    }

    access(CollectionOwner) fun borrowProject(projectId: String): auth(ProjectOwner) &Project? {
      return &self.projects[projectId] as auth(ProjectOwner) &Project?
    }

    // use this function to vote on other projects proposals
    access(CollectionOwner) fun voteOnProjectAction(projectOwner: Address, projectId: String, actionUUID: UInt64, vote: Bool) {
      let collection: &Collection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                    ?? panic("A DAOTreasury doesn't exist here.")
      let project: &Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
      let manager: &Manager = project.borrowManagerPublic()
      let action: &MultiSignAction = manager.borrowAction(actionUUID: actionUUID)
      action.vote(acctAddress: self.owner!.address, vote: vote)

      if manager.readyToFinalize(actionUUID: actionUUID) {
        project.finalizeAction(actionUUID: actionUUID)
      }
    }

    access(CollectionOwner) fun deleteProject(projectId: String) {
      destroy self.projects.remove(key: projectId)
    }

    init() {
      self.projects <- {}
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


  access(all) enum ActionState: UInt8 {
    access(all) case ACCEPTED
    access(all) case DECLINED
    access(all) case PENDING
  }

  access(all) resource MultiSignAction {
      access(all) let action: {ToucansActions.Action}
      access(self) let signers: [Address]
      access(self) let votes: {Address: Bool}
      access(all) let threshold: UInt64

      access(contract) fun vote(acctAddress: Address, vote: Bool) {
        pre {
          self.signers.contains(acctAddress): "This person cannot vote."
        }
        self.votes[acctAddress] = vote
      }

      access(all) view fun getSigners(): [Address] {
          return self.signers
      }

      // Only returns people who have actually voted
      access(all) view fun getVotes(): {Address: Bool} {
        return self.votes
      }

      access(all) view fun getAccepted(): UInt64 {
        var count: UInt64 = 0
        for voter in self.votes.keys {
            if self.votes[voter]! {
                count = count + 1
            }
        }
        return count
      }

      access(all) view fun getDeclined(): UInt64 {
        var count: UInt64 = 0
        for voter in self.votes.keys {
            if !self.votes[voter]! {
                count = count + 1
            }
        }
        return count
      }

      access(all) view fun getActionState(): ActionState {
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
  
  access(all) resource Manager {
    access(all) var threshold: UInt64
    access(self) let signers: [Address]
    // Maps the `uuid` of the MultiSignAction
    // to the resource itself
    access(self) let actions: @{UInt64: MultiSignAction}

    access(account) fun createMultiSign(action: {ToucansActions.Action}) {
      var threshold: UInt64 = self.threshold
      var signers: [Address] = self.signers
      if action.getType() == Type<ToucansActions.AddOneSigner>() {
        let addSignerAction = action as! ToucansActions.AddOneSigner
        threshold = threshold + 1
        signers.append(addSignerAction.signer)
      }
      // ADD THIS BACK IF IT MAKES SENSE
      // if action.getType() == Type<ToucansActions.RemoveOneSigner>() {
      //   let removeSignerAction = action as! ToucansActions.RemoveOneSigner
      //   threshold = threshold - 1
      //   signers.remove(at: signers.firstIndex(of: removeSignerAction.signer)!)
      // }
      let newAction <- create MultiSignAction(_threshold: threshold, _signers: signers, _action: action)
      self.actions[newAction.uuid] <-! newAction
    }

    access(all) view fun getActionState(actionUUID: UInt64): ActionState {
      let actionRef: &MultiSignAction = (&self.actions[actionUUID] as &MultiSignAction?)!
      return actionRef.getActionState()
    }

    access(all) view fun readyToFinalize(actionUUID: UInt64): Bool {
      let actionState: ActionState = self.getActionState(actionUUID: actionUUID)
      return actionState != ActionState.PENDING
    }

    // We do not make this public because if anyone else wants to use
    // this contract, they may want specific access control over who can
    // actually execute an action, post conditions, and/or implement requirements
    // (like the treasury must have >= 10 $FLOW before an action can be executed).
    access(account) fun destroyAction(actionUUID: UInt64) {
      destroy self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
      self.assertValidTreasury()
    }

    // These will be multisign actions themselves
    access(account) fun addSigner(signer: Address) {
      pre {
        !self.signers.contains(signer): "This wallet is already a signer."
      }
      self.signers.append(signer)
      self.assertValidTreasury()
    }

    access(account) fun removeSigner(signer: Address) {
      pre {
        self.signers.contains(signer): "This wallet is not already a signer."
      }
      self.signers.remove(at: self.signers.firstIndex(of: signer)!)

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

    access(all) fun borrowAction(actionUUID: UInt64): &MultiSignAction {
      return (&self.actions[actionUUID] as &MultiSignAction?)!
    }

    access(all) view fun getIDs(): [UInt64] {
      return self.actions.keys
    }

    access(all) view fun getSigners(): [Address] {
      return self.signers
    }

    access(all) fun assertValidTreasury() {
      assert(self.threshold > 0, message: "Threshold must be greater than 0.")
      assert(self.signers.length > 0, message: "Number of signers must be greater than 0.")
      assert(self.signers.length >= Int(self.threshold), message: "Number of signers must be greater than or equal to the threshold.")
    }

    init(_initialSigners: [Address], _initialThreshold: UInt64) {
      self.signers = _initialSigners
      self.actions <- {}
      self.threshold = _initialThreshold
      self.assertValidTreasury()
    }
  }
      
  access(all) fun createMultiSigManager(signers: [Address], threshold: UInt64): @Manager {
      return <- create Manager(_initialSigners: signers, _initialThreshold: threshold)
  }

  access(all) fun createCollection(): @Collection {
    return <- create Collection()
  }

  access(all) fun assertNonConflictingCycles(earlierCycle: FundingCycleDetails, laterCycle: FundingCycleDetails) {
    let earlierCycleStartsEarlier = earlierCycle.timeframe.startTime < laterCycle.timeframe.startTime
    let earlierCycleEndsBeforeLaterStarts = earlierCycle.timeframe.endTime == nil || (earlierCycle.timeframe.endTime! < laterCycle.timeframe.startTime)
    assert(earlierCycleStartsEarlier && earlierCycleEndsBeforeLaterStarts, message: "Conflicting cycles!")
  }

  init() {
    self.CollectionStoragePath = /storage/ToucansCollection
    self.CollectionPublicPath = /public/ToucansCollection
  }

}
 