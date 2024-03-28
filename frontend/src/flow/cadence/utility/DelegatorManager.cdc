/**

# Staking delegators management for liquid staking

# Author: Increment Labs

*/

import FlowToken from "./FlowToken.cdc"
import FungibleToken from "./FungibleToken.cdc"

import FlowIDTableStaking from "./FlowIDTableStaking.cdc"
import FlowEpoch from "./FlowEpoch.cdc"

import stFlowToken from "./stFlowToken.cdc"
import LiquidStakingConfig from "./LiquidStakingConfig.cdc"
import LiquidStakingError from "./LiquidStakingError.cdc"

access(all) contract DelegatorManager {
    /// All delegators managed by liquid staking protocol
    /// {delegator uuid -> NodeDelegator}
    access(self) let allDelegators: @{UInt64: FlowIDTableStaking.NodeDelegator}

    /// Weight list of nodes eligible to receive delegates, used by the delegation strategy
    /// {approvedNodeID -> weight}
    access(self) let approvedNodeIDList: {String: UFix64}
    
    /// Resource ids of delegator objects on approved nodes
    /// {approvedNodeID -> delegator uuid}
    access(self) let approvedDelegatorIDs: {String: UInt64}

    /// Resource ids of migrated delegators of nodes
    /// nodeIDs might be outside of approvedNodeIDList, as these are migrated delegators.
    /// {nodeID -> {delegatorID -> uuid}}
    access(self) let migratedDelegatorIDs: {String: {UInt32: UInt64}}
    
    /// Epoch number of the latest liquid staking round
    /// When a new flowchain epoch starts, a new liquid staking round won't start until all rewards
    /// are collected and stFlow price is updated accordingly.
    access(all) var quoteEpochCounter: UInt64

    /// The default node ID for staking
    /// All newly committed tokens will be temporarily delegated to this node by default
    /// Delegation strategy will distribute these committed tokens to other nodes' before end of staking period
    access(all) var defaultNodeIDToStake: String

    /// All unstaking requests are temporarily cached here.
    /// Strategy bots will handle cached unstaking requests before staking auction end
    access(all) var requestedToUnstake: UFix64

    /// Collect and aggregate all rewards & unstaked tokens from all delegators at the beginning of each epoch
    access(self) let totalRewardedVault: @FlowToken.Vault
    access(self) let totalUnstakedVault: @FlowToken.Vault

    /// All epoch snapshot history
    /// {epoch index -> snapshot}
    access(self) let epochSnapshotHistory: {UInt64: EpochSnapshot}

    /// Vault of protocol fees
    access(self) let protocolFeeVault: @FlowToken.Vault

    /// Paths
    access(all) let adminPath: StoragePath
    access(all) let delegationStrategyPath: StoragePath

    /// Events
    access(all) event NewQuoteEpoch(epoch: UInt64)
    access(all) event RegisterNewDelegator(nodeID: String, delegatorID: UInt32)
    access(all) event RewardsInfoCheckpointed(currEpoch: UInt64, received: UFix64, estimated: UFix64, estimateNextReward: UFix64)
    access(all) event DepositProtocolFees(amount: UFix64, purpose: String)
    access(all) event ExternalRewardsContributed(amount: UFix64)
    access(all) event RestakeCanceledTokens(amount: UFix64, type: String, fromProtocolEpoch: UInt64)
    access(all) event RedelegateTokens(amount: UFix64, currEpoch: UInt64)
    access(all) event CompoundReward(rewardAmount: UFix64, protocolEpoch: UInt64)
    access(all) event DelegatorsCollected(startIndex: Int, endIndex: Int, uncollectedCount: Int)
    access(all) event StrategyTransferCommittedTokens(from: String, to: String, amount: UFix64)
    access(all) event StrategyProcessUnstakeRequest(amount: UFix64, nodeIDToUnstake: String, delegatorIDToUnstake: UInt32, leftoverAmount: UFix64)
    access(all) event DelegatorRemoved(nodeID: String, delegatorID: UInt32, uuid: UInt64)
    access(all) event SetApprovedNodeList(nodeIDs: {String: UFix64}, defaultNodeIDToStake: String)
    access(all) event UpsertApprovedNode(nodeID: String, oldWeight: UFix64?, newWeight: UFix64)
    access(all) event SetDefaultStakeNode(from: String, to: String)
    access(all) event ApprovedNodeCanceled(nodeID: String)
    access(all) event ApprovedNodeRemoved(nodeID: String)
    access(all) event RedelegateRequested(nodeID: String, delegatorID: UInt32, redelegateCommittedAmount: UFix64, redelegateRequestToUnstake: UFix64)
    
    /// Reserved parameter fields: {ParamName: Value}
    access(self) let _reservedFields: {String: AnyStruct}

    /// Snapshot data of a historical Flow network Epoch
    ///
    /// Strategy bots will collect rewards from all managed delegators (up to 50,000) when a new flow chain epoch starts,
    /// and then update the new stFlow token price for the next round of liquid staking protocol
    access(all) struct EpochSnapshot {
        // Snapshotted protocol epoch
        access(all) let epochCounter: UInt64

        /// Price: stFlow to Flow (>= 1.0)
        access(all) var scaledQuoteStFlowFlow: UInt256
        /// Price: Flow to stFlow (<= 1.0)
        access(all) var scaledQuoteFlowStFlow: UInt256

        /// Total staked amount of all delegators
        access(all) var allDelegatorStaked: UFix64
        /// Total committed amount of all delegators
        access(all) var allDelegatorCommitted: UFix64
        /// Total requests to unstake of all delegators
        access(all) var allDelegatorRequestedToUnstake: UFix64

        /// After-fee total rewards received of current protocol epoch
        access(all) var receivedReward: UFix64
        /// Estimated rewards to be received
        access(all) var estimatedReward: UFix64

        /// Snapshotted delegator infos
        /// {nodeID -> {delegatorID -> DelegatorInfo}}
        access(self) let delegatorInfoDict: {String: {UInt32: FlowIDTableStaking.DelegatorInfo}}

        /// { delegator uuid -> collected? }
        access(self) let delegatorCollected: {UInt64: Bool}

        /// Canceled committed tokens of protocol epoch N is checkpointed in DelegatorManager.epochSnapshotHistory[N+1]
        /// Restake protocol epoch N's canceledCommittedTokens before advancing into protocol epoch N+1
        access(all) var canceledCommittedTokens: UFix64
        /// Canceled staked tokens of protocol epoch N is checkpointed in DelegatorManager.epochSnapshotHistory[N+1]
        /// Restake protocol epoch N-1's canceledStakedTokens before advancing into next protocol
        access(all) var canceledStakedTokens: UFix64

        /// Tokens that are requested to unstake, will be in unstaking mode in the next protocol epoch
        access(all) var redelegatedTokensRequestToUnstake: UFix64
        /// Tokens in unstaking mode, will be turned to unstaked (and available to be restaked) in the next protocol epoch
        access(all) var redelegatedTokensUnderUnstaking: UFix64

        /// Start time of new quote epoch
        access(all) var quoteEpochStartTimestamp: UFix64
        access(all) var quoteEpochStartBlockHeight: UInt64
        access(all) var quoteEpochStartBlockView: UInt64

        /// Update or insert the snapshotted delegator info
        access(contract) fun upsertDelegatorInfo(nodeID: String, delegatorID: UInt32) {
            let delegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
            
            if self.delegatorInfoDict.containsKey(nodeID) == false {
                self.delegatorInfoDict[nodeID] = {}
            } else {
                if self.delegatorInfoDict[nodeID]!.containsKey(delegatorID) == true {
                    self.allDelegatorStaked = self.allDelegatorStaked - self.delegatorInfoDict[nodeID]![delegatorID]!.tokensStaked
                    self.allDelegatorCommitted = self.allDelegatorCommitted - self.delegatorInfoDict[nodeID]![delegatorID]!.tokensCommitted
                    self.allDelegatorRequestedToUnstake = self.allDelegatorRequestedToUnstake - self.delegatorInfoDict[nodeID]![delegatorID]!.tokensRequestedToUnstake
                }
            }

            self.allDelegatorStaked = self.allDelegatorStaked + delegatorInfo.tokensStaked
            self.allDelegatorCommitted = self.allDelegatorCommitted + delegatorInfo.tokensCommitted
            self.allDelegatorRequestedToUnstake = self.allDelegatorRequestedToUnstake + delegatorInfo.tokensRequestedToUnstake

            self.delegatorInfoDict[nodeID]!.insert(key: delegatorID, delegatorInfo)
        }

        /// Delegator count that has been collected
        access(all) fun getCollectedDelegatorCount(): Int {
            return self.delegatorCollected.length
        }

        access(all) fun isDelegatorCollected(uuid: UInt64): Bool {
            return self.delegatorCollected.containsKey(uuid)
        }

        access(all) fun borrowDelegatorInfo(nodeID: String, delegatorID: UInt32): &FlowIDTableStaking.DelegatorInfo? {
            if self.delegatorInfoDict.containsKey(nodeID) == false {
                return nil
            }
            return &self.delegatorInfoDict[nodeID]![delegatorID] as &FlowIDTableStaking.DelegatorInfo?
        }

        access(all) fun getNodeIDList(): [String] {
            return self.delegatorInfoDict.keys
        }

        access(all) fun getDelegatorIDListOnNode(nodeID: String): [UInt32] {
            return self.delegatorInfoDict[nodeID] == nil ? [] : self.delegatorInfoDict[nodeID]!.keys
        }

        access(contract) fun markDelegatorCollected(uuid: UInt64) {
            self.delegatorCollected.insert(key: uuid, true)
        }

        access(contract) fun removeDelegatorInfo(nodeID: String, delegatorID: UInt32) {
            if self.delegatorInfoDict.containsKey(nodeID) && self.delegatorInfoDict[nodeID]!.containsKey(delegatorID) {
                let delegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
                assert(
                    delegatorInfo.totalTokensInRecord() + delegatorInfo.tokensRequestedToUnstake == 0.0,
                    message: "cannot remove delegator info still in-use"
                )
                self.delegatorInfoDict[nodeID]!.remove(key: delegatorID)
            }
        }

        access(contract) fun setReceivedReward(received: UFix64) {
            self.receivedReward = received
        }

        access(contract) fun setEstimatedReward(estimated: UFix64) {
            self.estimatedReward = estimated
        }

        access(contract) fun addCanceledCommittedTokens(amount: UFix64) {
            self.canceledCommittedTokens = self.canceledCommittedTokens + amount
        }

        access(contract) fun addCanceledStakedTokens(amount: UFix64) {
            self.canceledStakedTokens = self.canceledStakedTokens + amount
        }

        access(contract) fun addRedelegatedTokensRequestToUnstake(amount: UFix64) {
            self.redelegatedTokensRequestToUnstake = self.redelegatedTokensRequestToUnstake + amount
        }

        access(contract) fun addRedelegatedTokensUnderUnstaking(amount: UFix64) {
            self.redelegatedTokensUnderUnstaking = self.redelegatedTokensUnderUnstaking + amount
        }

        access(contract) fun setStflowPrice(stFlowToFlow: UInt256, flowToStFlow: UInt256) {
            self.scaledQuoteStFlowFlow = stFlowToFlow
            self.scaledQuoteFlowStFlow = flowToStFlow
        }

        init(epochCounter: UInt64) {
            self.epochCounter = epochCounter

            self.allDelegatorStaked = 0.0
            self.allDelegatorCommitted = 0.0
            self.allDelegatorRequestedToUnstake = 0.0

            self.receivedReward = 0.0
            self.estimatedReward = 0.0

            self.scaledQuoteStFlowFlow = LiquidStakingConfig.UFix64ToScaledUInt256(1.0)
            self.scaledQuoteFlowStFlow = LiquidStakingConfig.UFix64ToScaledUInt256(1.0)

            self.delegatorInfoDict = {}
            self.delegatorCollected = {}

            self.canceledCommittedTokens = 0.0
            self.canceledStakedTokens = 0.0

            self.redelegatedTokensRequestToUnstake = 0.0
            self.redelegatedTokensUnderUnstaking = 0.0

            let currentBlock = getCurrentBlock()
            self.quoteEpochStartTimestamp = currentBlock.timestamp
            self.quoteEpochStartBlockHeight = currentBlock.height
            self.quoteEpochStartBlockView = currentBlock.view
        }
    }

    /// Start a new liquid staking epoch after all protocol managed delegators have been collected
    access(self) fun advanceEpoch() {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "can only advance protocol epoch after a new chain epoch starts"
        }

        // Checkpoint rewards info
        self.snapshotRewardsInfo()

        // Check if approved nodes is stakable
        self.filterApprovedNodeListOnEpochStart()

        // Re-commit canceled tokens
        self.restakeCanceledTokens()

        // Re-commit redelegated tokens
        self.redelegateTokens()

        // Checkpoint stFlow price for the next epoch
        self.stFlowQuote()

        // Finally, start the new protocol epoch
        self.quoteEpochCounter = FlowEpoch.currentEpochCounter
        
        emit NewQuoteEpoch(epoch: self.quoteEpochCounter)
    }

    /// Calculate and checkpoint stFlow price for the next epoch
    ///
    ///                      [currentReward] + [totalCommitted] + [totalStaked]
    /// stFlow_Flow price = ---------------------------------------------------
    ///                                    [stFlow totalSupply]
    ///
    access(self) fun stFlowQuote() {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "stFlow price can only be checkpointed after new chain epoch and before new protocol epoch start"
        }

        let nextEpochSnapshot = self.borrowCurrentChainEpochSnapshot()

        let currentReward = self.totalRewardedVault.balance

        let totalCommitted = nextEpochSnapshot.allDelegatorCommitted

        let totalStaked = nextEpochSnapshot.allDelegatorStaked
                                    + nextEpochSnapshot.canceledStakedTokens
                                    + nextEpochSnapshot.redelegatedTokensRequestToUnstake
                                    + nextEpochSnapshot.redelegatedTokensUnderUnstaking
                                    - self.requestedToUnstake
                                    - nextEpochSnapshot.allDelegatorRequestedToUnstake

        let flowSupply = currentReward + totalCommitted + totalStaked
        let stFlowSupply = stFlowToken.totalSupply

        var stFlow_flow: UInt256 = 0
        var flow_stFlow: UInt256 = 0
        if flowSupply == 0.0 || stFlowSupply == 0.0 {
            stFlow_flow = LiquidStakingConfig.UFix64ToScaledUInt256(1.0)
            flow_stFlow = LiquidStakingConfig.UFix64ToScaledUInt256(1.0)
        } else {
            let scaledFlowSupply = LiquidStakingConfig.UFix64ToScaledUInt256(flowSupply)
            let scaledStFlowSupply = LiquidStakingConfig.UFix64ToScaledUInt256(stFlowSupply)

            stFlow_flow = scaledFlowSupply * LiquidStakingConfig.scaleFactor / scaledStFlowSupply
            flow_stFlow = scaledStFlowSupply * LiquidStakingConfig.scaleFactor / scaledFlowSupply
        }

        nextEpochSnapshot.setStflowPrice(stFlowToFlow: stFlow_flow, flowToStFlow: flow_stFlow)
    }

    /// Deposit flowToken to the default NodeDelegator. DelegationStrategy will redistribute to other approved nodes.
    ///
    /// Called by LiquidStaking::stake()
    access(all) fun depositToCommitted(flowVault: @FlowToken.Vault) {
        let defaultDelegator = self.borrowApprovedDelegatorFromNode(self.defaultNodeIDToStake)
            ?? panic("delegator object not found from the defaultNodeToStake")
        // Stake to the committed vault
        defaultDelegator.delegateNewTokens(from: <-flowVault)

        // Update snapshot
        if FlowEpoch.currentEpochCounter > self.quoteEpochCounter {
            self.borrowCurrentChainEpochSnapshot().upsertDelegatorInfo(nodeID: defaultDelegator.nodeID, delegatorID: defaultDelegator.id)
        } else {
            self.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: defaultDelegator.nodeID, delegatorID: defaultDelegator.id)
        }
    }

    /// Withdraw flow tokens from committed vault
    ///
    /// Called by LiquidStaking::unstakeQuickly()
    access(all) fun withdrawFromCommitted(amount: UFix64): @FlowToken.Vault {
        // All committed tokens will be accumulated in the default node's delegator
        // until they are distributed to other delegators by delegation strategy before the end of the staking stage
        let defaultDelegator = self.borrowApprovedDelegatorFromNode(self.defaultNodeIDToStake)
            ?? panic("delegator object not found from the defaultNodeToStake")
        let defaultDelegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: defaultDelegator.nodeID, delegatorID: defaultDelegator.id)

        assert(defaultDelegatorInfo.tokensCommitted >= amount, message: "Not enough committed tokens to withdraw")

        // Cancel the committed tokens from delegator
        defaultDelegator.requestUnstaking(amount: amount)

        let flowVault <- defaultDelegator.withdrawUnstakedTokens(amount: amount)

        // Update snapshot
        self.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: defaultDelegator.nodeID, delegatorID: defaultDelegator.id)

        return <-(flowVault as! @FlowToken.Vault)
    }

    /// All unstaking requests are marked and will be processed before staking auction end
    ///
    /// Called by LiquidStaking::unstake()
    access(all) fun requestWithdrawFromStaked(amount: UFix64) {
        let currentEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        assert(
            currentEpochSnapshot.allDelegatorStaked + currentEpochSnapshot.allDelegatorCommitted
                >=
                amount + currentEpochSnapshot.allDelegatorRequestedToUnstake + self.requestedToUnstake
            , message: LiquidStakingError.ErrorEncode(
                msg: "Not enough tokens to request unstake",
                err: LiquidStakingError.ErrorCode.INVALID_PARAMETERS
            )
        )

        // mark unstake requests
        self.requestedToUnstake = self.requestedToUnstake + amount
    }

    /// Withdraw tokens from unstaked vault
    ///
    /// Called by LiquidStaking::cashoutWithdrawVoucher()
    access(all) fun withdrawFromUnstaked(amount: UFix64): @FlowToken.Vault {
        return <-(self.totalUnstakedVault.withdraw(amount: amount) as! @FlowToken.Vault)
    }

    /// Migrate Delegator
    ///
    /// Called by LiquidStaking::migrate()
    access(all) fun migrateDelegator(delegator: @FlowIDTableStaking.NodeDelegator) {
        let nodeID = delegator.nodeID
        let delegatorID = delegator.id
        let uuid = delegator.uuid
        
        self.insertMigratedDelegatorUUID(nodeID: nodeID, delegatorID: delegatorID, uuid: uuid)

        // Update snapshot
        self.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: delegator.nodeID, delegatorID: delegator.id)

        self.allDelegators[uuid] <-! delegator
    }

    /// Restake rewarded tokens to compound rewards.
    access(self) fun compoundRewards() {
        if (self.totalRewardedVault.balance > 0.0) {
            let rewardVault <- self.totalRewardedVault.withdraw(amount: self.totalRewardedVault.balance)
            emit CompoundReward(rewardAmount: rewardVault.balance, protocolEpoch: self.quoteEpochCounter)
            self.depositToCommitted(flowVault: <-(rewardVault as! @FlowToken.Vault))
        }
    }

    /// Restake any tokens staked to nodes canceled in the idtable
    access(self) fun restakeCanceledTokens() {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "restake canceled tokens can only happen after new chain epoch and before new protocol epoch start"
        }
        // Protocol epoch N
        let currEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        // Chain epoch N+1
        let nextEpochSnapshot = self.borrowCurrentChainEpochSnapshot()

        // restake canceled committed tokens from protocol epoch N, they are in unstaked mode in protocol epoch N+1
        if nextEpochSnapshot.canceledCommittedTokens > 0.0 {
            let canceledCommittedTokens <- self.totalUnstakedVault.withdraw(amount: nextEpochSnapshot.canceledCommittedTokens)
            self.depositToCommitted(flowVault: <-(canceledCommittedTokens as! @FlowToken.Vault))
            emit RestakeCanceledTokens(amount: nextEpochSnapshot.canceledCommittedTokens, type: "canceled-committed", fromProtocolEpoch: self.quoteEpochCounter)
        }

        // restake canceled staked tokens from protocol epoch N-1, they were in unstaking mode in protocol epoch N, and become unstaked in protocol epoch N+1
        if currEpochSnapshot.canceledStakedTokens > 0.0 {
            let canceledStakedTokens <- self.totalUnstakedVault.withdraw(amount: currEpochSnapshot.canceledStakedTokens)
            self.depositToCommitted(flowVault: <-(canceledStakedTokens as! @FlowToken.Vault))
            emit RestakeCanceledTokens(amount: currEpochSnapshot.canceledStakedTokens, type: "canceled-staked", fromProtocolEpoch: self.quoteEpochCounter - 1)
        }
    }

    /// Process redelegate requests and restake unstaked redelegated tokens
    access(self) fun redelegateTokens() {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "redelegate requests can only be processed after new chain epoch and before new protocol epoch start"
        }

        let currEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        let nextEpochSnapshot = self.borrowCurrentChainEpochSnapshot()

        // requestToUnstake tokens -> unstaking mode in the next protocol epoch
        if currEpochSnapshot.redelegatedTokensRequestToUnstake > 0.0 {
            nextEpochSnapshot.addRedelegatedTokensUnderUnstaking(amount: currEpochSnapshot.redelegatedTokensRequestToUnstake)
        }

        // unstaking mode -> unstaked in the next protocol epoch, and available to restake now
        if currEpochSnapshot.redelegatedTokensUnderUnstaking > 0.0 {
            let redelegatedVault <- self.totalUnstakedVault.withdraw(amount: currEpochSnapshot.redelegatedTokensUnderUnstaking)
            self.depositToCommitted(flowVault: <-(redelegatedVault as! @FlowToken.Vault))
            emit RedelegateTokens(amount: currEpochSnapshot.redelegatedTokensUnderUnstaking, currEpoch: self.quoteEpochCounter)
        }
    }

    /// Collect from all managed delegators on a new chain epoch
    ///
    /// Move unstaked & rewarded vaults from delegators -> totalUnstaked & totalRewarded vaults
    /// Collection will start immediately after the new chain epoch starts
    /// Due to the large amount of possible delegators (including migrated ones), collection will be processed in batches
    ///
    /// During this short time, no new stake request will be accepted until all managed delegators are collected,
    /// which will recalculate the price of stFlow this epoch
    ///
    /// This function is made public so anyone can call to keep the protocol moving
    /// This function should be implemented as idempotent
    access(all) fun collectDelegatorsOnEpochStart(startIndex: Int, endIndex: Int, ifAdvanceEpoch: Bool) {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "No need to collect, chain epoch not advanced yet"
            startIndex <= endIndex: "Invalid index"
        }

        // When underlying system's auto reward payment is turned on
        if FlowEpoch.automaticRewardsEnabled() == true {
            if self.quoteEpochCounter > 0 {
                assert(
                    FlowEpoch.getEpochMetadata(self.quoteEpochCounter)!.rewardsPaid == true, message:
                        LiquidStakingError.ErrorEncode(
                            msg: "Rewards has not been paid yet for protocol epoch ".concat(self.quoteEpochCounter.toString()),
                            err: LiquidStakingError.ErrorCode.STAKING_REWARD_NOT_PAID
                        )
                )
            }
        }

        // Create a new epoch when necessary
        if self.epochSnapshotHistory.containsKey(FlowEpoch.currentEpochCounter) == false {
            self.epochSnapshotHistory[FlowEpoch.currentEpochCounter] = EpochSnapshot(epochCounter: FlowEpoch.currentEpochCounter)
        }

        let currEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        let nextEpochSnapshot = self.borrowCurrentChainEpochSnapshot()

        let delegatorUUIDList = self.allDelegators.keys
        let delegatorLength = delegatorUUIDList.length
        var index = startIndex
        while index <= endIndex && index < delegatorLength {
            let uuid = delegatorUUIDList[index]
            if nextEpochSnapshot.isDelegatorCollected(uuid: uuid) {
                index = index + 1
                continue
            }

            let delegator = self.borrowManagedDelegator(uuid: uuid)!
            let nodeID = delegator.nodeID
            let delegatorID = delegator.id

            // Latest DelegatorInfo from flowchain idtable
            let latestDelegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
            // Cached DelegatorInfo for the current protocol epoch
            let currDelegatorInfo = currEpochSnapshot.borrowDelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
            // After FlowIDTableStaking::moveTokens(), delegators should be no committed tokens left
            assert(latestDelegatorInfo.tokensCommitted == 0.0, message: "Panic: committed tokens has not been moved to staked vault")

            if (currDelegatorInfo != nil) {
                if FlowEpoch.automaticRewardsEnabled() == false {
                    // Hmm... the manual reward payment is somehow delayed
                    if latestDelegatorInfo.tokensRewarded == 0.0 && currDelegatorInfo!.tokensStaked >= LiquidStakingConfig.minStakingAmount {
                        // Clear the previous collection, waiting for reward payment
                        self.epochSnapshotHistory.remove(key: FlowEpoch.currentEpochCounter)
                        return
                    }
                }

                // !!
                // The node was canceled in FlowIDTableStaking::removeUnapprovedNodes()
                //   staked tokens    -> unstaking vault
                //   committed tokens -> unstaked vault
                if latestDelegatorInfo.tokensStaked == 0.0
                    &&
                    (currDelegatorInfo!.tokensCommitted > 0.0 || (currDelegatorInfo!.tokensStaked - currDelegatorInfo!.tokensRequestedToUnstake > 0.0)) {
                    
                    // Tokens that are forcely canceled, need to be re-committed
                    let tokensToRecommitNow = currDelegatorInfo!.tokensCommitted
                    let tokensToRecommitNextEpoch = currDelegatorInfo!.tokensStaked - currDelegatorInfo!.tokensRequestedToUnstake
                    
                    nextEpochSnapshot.addCanceledCommittedTokens(amount: tokensToRecommitNow)
                    nextEpochSnapshot.addCanceledStakedTokens(amount: tokensToRecommitNextEpoch)
                }
            }

            // Collect rewarded tokens
            if latestDelegatorInfo.tokensRewarded > 0.0 {
                self.totalRewardedVault.deposit(from: <-delegator.withdrawRewardedTokens(amount: latestDelegatorInfo.tokensRewarded))
            }

            // Collect unstaked tokens
            if latestDelegatorInfo.tokensUnstaked > 0.0 {
                self.totalUnstakedVault.deposit(from: <-delegator.withdrawUnstakedTokens(amount: latestDelegatorInfo.tokensUnstaked))
            }

            // Update snapshot
            nextEpochSnapshot.upsertDelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
            nextEpochSnapshot.markDelegatorCollected(uuid: uuid)

            index = index + 1
        }

        // If all delegators have been collected
        let collectedCount = nextEpochSnapshot.getCollectedDelegatorCount()
        if collectedCount == self.allDelegators.length && ifAdvanceEpoch == true {
            self.advanceEpoch()
        }

        emit DelegatorsCollected(startIndex: startIndex, endIndex: endIndex, uncollectedCount: self.allDelegators.length - collectedCount)
    }

    access(contract) fun insertMigratedDelegatorUUID(nodeID: String, delegatorID: UInt32, uuid: UInt64) {
        if self.migratedDelegatorIDs.containsKey(nodeID) == false {
            self.migratedDelegatorIDs[nodeID] = {}
        }

        assert(self.migratedDelegatorIDs[nodeID]!.containsKey(delegatorID) == false, message: "Reinsert delegator uuid")

        self.migratedDelegatorIDs[nodeID]!.insert(key: delegatorID, uuid)
    }

    /// Snapshot rewards info after all delegator's rewards & unstaked tokens have been collected
    access(self) fun snapshotRewardsInfo() {
        pre {
            FlowEpoch.currentEpochCounter > self.quoteEpochCounter: "Rewards info can only be snapshotted after new chain epoch and before new protocol epoch start"
        }
        // Protocol epoch N
        let currEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        // Chain epoch N+1
        let nextEpochSnapshot = self.borrowCurrentChainEpochSnapshot()

        assert(
            nextEpochSnapshot.getCollectedDelegatorCount() == self.allDelegators.length,
            message: "All delegators should have been collected"
        )

        // Checkpoint received reward for protocol epoch N
        if LiquidStakingConfig.protocolFee > 0.0 {
            let feeVault <- self.totalRewardedVault.withdraw(amount: self.totalRewardedVault.balance * LiquidStakingConfig.protocolFee)
            self.depositToProtocolFees(flowVault: <-feeVault, purpose: "epoch reward cut -> protocol fee")
        }
        currEpochSnapshot.setReceivedReward(received: self.totalRewardedVault.balance)

        // Checkpoint estimated rewards to be received for protocol epoch N+1
        let estimatedNextEpochAmount = LiquidStakingConfig.calcEstimatedStakingPayout(stakedAmount: nextEpochSnapshot.allDelegatorStaked)
        nextEpochSnapshot.setEstimatedReward(estimated: estimatedNextEpochAmount)

        emit RewardsInfoCheckpointed(currEpoch: self.quoteEpochCounter, received: currEpochSnapshot.receivedReward, estimated: currEpochSnapshot.estimatedReward, estimateNextReward: nextEpochSnapshot.estimatedReward)
    }

    /// Check protocol's approved nodes against FlowIDTableStaking.getStakedNodeIDs()
    access(self) fun filterApprovedNodeListOnEpochStart() {
        let stakableNodeList = FlowIDTableStaking.getStakedNodeIDs()
        let currentApprovedNodeIDList = self.approvedNodeIDList.keys

        for nodeID in currentApprovedNodeIDList {
            if stakableNodeList.contains(nodeID) {
                continue
            }
            
            if nodeID == self.defaultNodeIDToStake {
                self.defaultNodeIDToStake = ""
            }

            self.removeApprovedNodeID(nodeID: nodeID)

            emit ApprovedNodeCanceled(nodeID: nodeID)
        }

        if self.defaultNodeIDToStake == "" && self.approvedNodeIDList.length > 0 {
            self.defaultNodeIDToStake = self.approvedNodeIDList.keys[0]
        }
    }

    access(self) fun borrowManagedDelegator(uuid: UInt64): &FlowIDTableStaking.NodeDelegator? {
        return &self.allDelegators[uuid] as &FlowIDTableStaking.NodeDelegator?
    }

    access(self) fun removeManagedDelegator(uuid: UInt64) {
        let tmpDelegator <- self.allDelegators[uuid] <- nil
        destroy tmpDelegator
    }

    access(self) fun borrowApprovedDelegatorFromNode(_ nodeID: String): &FlowIDTableStaking.NodeDelegator? {
        if (self.approvedNodeIDList.containsKey(nodeID) && self.approvedDelegatorIDs.containsKey(nodeID)) == false {
            return nil
        }
        let uuid = self.approvedDelegatorIDs[nodeID]!
        return self.borrowManagedDelegator(uuid: uuid)
    }

    /// Register a new delegator object on an approved staking node
    access(self) fun registerApprovedDelegator(_ nodeID: String, _ initialCommit: @FungibleToken.Vault) {
        pre {
            FlowIDTableStaking.getStakedNodeIDs().contains(nodeID): "Cannot stake to the inactive node: ".concat(nodeID)
            self.approvedNodeIDList.containsKey(nodeID): "Cannot register delegator on nodes out of approved list"
            !self.approvedDelegatorIDs.containsKey(nodeID): "Delegator object on the given node has already existed"
            initialCommit.balance >= FlowIDTableStaking.getDelegatorMinimumStakeRequirement(): "Initial commitment for delegator registration < system threshold"
        }

        let nodeDelegator <- FlowIDTableStaking.registerNewDelegator(nodeID: nodeID, tokensCommitted: <- initialCommit)
        emit RegisterNewDelegator(nodeID: nodeDelegator.nodeID, delegatorID: nodeDelegator.id)

        let uuid = nodeDelegator.uuid
        self.approvedDelegatorIDs[nodeDelegator.nodeID] = uuid
        self.allDelegators[uuid] <-! nodeDelegator
    }

    access(self) fun removeApprovedNodeID(nodeID: String) {
        pre {
            self.approvedNodeIDList.containsKey(nodeID): "Nonexistent nodeID to remove"
            self.defaultNodeIDToStake != nodeID: "Default commit node should be reappointed before removing"
        }
        // No delegator on this nodeID
        if self.approvedDelegatorIDs.containsKey(nodeID) == false {
            self.approvedNodeIDList.remove(key: nodeID)
            return
        }

        let uuid = self.approvedDelegatorIDs[nodeID]!
        let delegatorRef = self.borrowManagedDelegator(uuid: uuid)!
        let delegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: delegatorRef.nodeID, delegatorID: delegatorRef.id)
        // Committed tokens should be restaked to other approved nodes, especially if the default staking node is to be removed.
        assert(delegatorInfo.tokensCommitted == 0.0, message: "Committed tokens should be moved out before removing")
        
        self.approvedNodeIDList.remove(key: nodeID)
        
        // Move delegator record from approved list to migrated list, so it won't receive future delegates and will be unstaked in priority.
        self.approvedDelegatorIDs.remove(key: nodeID)
        self.insertMigratedDelegatorUUID(nodeID: delegatorRef.nodeID, delegatorID: delegatorRef.id, uuid: uuid)
    }

    access(all) fun depositToProtocolFees(flowVault: @FungibleToken.Vault, purpose: String) {
        emit DepositProtocolFees(amount: flowVault.balance, purpose: purpose)
        self.protocolFeeVault.deposit(from: <-flowVault)
    }

    /// Contribute additional $flow to rewardedVault for whatever reason (e.g. partnership nodes' node-cut reimbursement, donation, etc.).
    /// This will boost $stFlow price (and also liquid staking apr) in the next epoch
    access(all) fun addReward(rewardedVault: @FlowToken.Vault) {
        pre {
            FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot addReward until protocol epoch syncs"
        }
        emit ExternalRewardsContributed(amount: rewardedVault.balance)
        self.totalRewardedVault.deposit(from: <-rewardedVault)
    }

    /// Amount of flowTokens the liquid staking protocol is fully backed by
    access(all) fun getTotalValidStakingAmount(): UFix64 {
        let currentEpochSnapshot = self.borrowCurrentQuoteEpochSnapshot()
        let totalValidStakingAmount = currentEpochSnapshot.allDelegatorStaked 
                                        + currentEpochSnapshot.allDelegatorCommitted
                                        + currentEpochSnapshot.canceledStakedTokens
                                        + currentEpochSnapshot.redelegatedTokensUnderUnstaking
                                        + currentEpochSnapshot.redelegatedTokensRequestToUnstake
                                        + self.totalRewardedVault.balance
                                        - currentEpochSnapshot.allDelegatorRequestedToUnstake
                                        - self.requestedToUnstake
        return totalValidStakingAmount
    }

    access(all) fun borrowEpochSnapshot(at: UInt64): &EpochSnapshot {
        return (&self.epochSnapshotHistory[at] as &EpochSnapshot?) ?? panic("EpochSnapshot index out of range")
    }

    access(all) fun borrowCurrentChainEpochSnapshot(): &EpochSnapshot {
        return self.borrowEpochSnapshot(at: FlowEpoch.currentEpochCounter)
    }

    access(all) fun borrowCurrentQuoteEpochSnapshot(): &EpochSnapshot {
        return self.borrowEpochSnapshot(at: self.quoteEpochCounter)
    }

    access(all) fun getDelegatorUUIDByID(nodeID: String, delegatorID: UInt32): UInt64? {
        if self.migratedDelegatorIDs.containsKey(nodeID) {
            if self.migratedDelegatorIDs[nodeID]!.containsKey(delegatorID) {
                return self.migratedDelegatorIDs[nodeID]![delegatorID]
            }
        }
        if let delegator = self.borrowApprovedDelegatorFromNode(nodeID) {
            if delegator.id == delegatorID {
                return self.approvedDelegatorIDs[nodeID]!
            }
        }
        return nil
    }

    access(all) fun getApprovedNodeList(): {String: UFix64} {
        return self.approvedNodeIDList
    }

    /// Get all approved delegator uuids keyed by nodeID
    /// Up to 400 nodes, do not worry about the gas-limit
    access(all) fun getApprovedDelegatorIDs(): {String: UInt64} {
        return self.approvedDelegatorIDs
    }

    /// NodeID list that involves with migrated delegators
    /// Up to 400 nodes, do not worry about the gas-limit
    access(all) fun getMigratedNodeIDList(): [String] {
        return self.migratedDelegatorIDs.keys
    }

    access(all) fun getMigratedDelegatorLength(nodeID: String): Int {
        return self.migratedDelegatorIDs[nodeID]!.length
    }
    
    access(all) fun getSlicedMigratedDelegatorIDList(nodeID: String, from: Int, to: Int): [UInt32] {
        var upTo = to
        if upTo > self.migratedDelegatorIDs[nodeID]!.length {
            upTo = self.migratedDelegatorIDs[nodeID]!.length
        }
        return self.migratedDelegatorIDs[nodeID]!.keys.slice(from: from, upTo: upTo)
    }

    access(all) fun getProtocolFeeBalance(): UFix64 {
        return self.protocolFeeVault.balance
    }

    access(all) fun getDelegatorInfoByUUID(delegatorUUID: UInt64): FlowIDTableStaking.DelegatorInfo {
        let delegator = self.borrowManagedDelegator(uuid: delegatorUUID)
            ?? panic("delegator not managed by liquid staking protocol")
        let nodeID = delegator.nodeID
        let delegatorID = delegator.id
        return FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
    }

    access(all) fun getApprovedDelegatorInfoByNodeID(nodeID: String): FlowIDTableStaking.DelegatorInfo {
        let delegator = self.borrowApprovedDelegatorFromNode(nodeID)
            ?? panic("approved delegator not found on given node")
        let nodeID = delegator.nodeID
        let delegatorID = delegator.id
        return FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
    }

    /// [from, to)
    access(all) fun getSlicedDelegatorUUIDList(from: Int, to: Int): [UInt64] {
        let UUIDs = self.allDelegators.keys
        var upTo = to
        if upTo > UUIDs.length {
            upTo = UUIDs.length
        }
        return UUIDs.slice(from: from, upTo: upTo)
    }

    access(all) fun getTotalUnstakedVaultBalance(): UFix64 {
        return self.totalUnstakedVault.balance
    }

    access(all) fun getDelegatorsLength(): Int {
        return self.allDelegators.length
    }

    /// Used together with offchain strategy bots
    access(all) resource DelegationStrategy {

        /// Transfer committed tokens among delegators.
        /// Utilized by strategy bots to redistribute newly staked $flow to different nodes for the sake of protocol decentralization,
        /// and also to get rid of single point of failure.
        access(all) fun transferCommittedTokens(fromNodeID: String, toNodeID: String, amount: UFix64) {
            pre {
                FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot transfer comitted tokens until protocol epoch syncs"
                fromNodeID != toNodeID: "Cannot transfer tokens among same nodes"
            }
            let fromDelegator = DelegatorManager.borrowApprovedDelegatorFromNode(fromNodeID)
                ?? panic("cannot borrow from approved delegator of fromNode")
            let toDelegator = DelegatorManager.borrowApprovedDelegatorFromNode(toNodeID)
                ?? panic("cannot borrow from approved delegator of toNode")
            let fromDelegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: fromNodeID, delegatorID: fromDelegator.id)

            assert(fromDelegatorInfo.tokensCommitted >= amount, message: "try to transfer more than fromNode.committed")

            // withdraw committed
            fromDelegator.requestUnstaking(amount: amount)
            let transferVault <- fromDelegator.withdrawUnstakedTokens(amount: amount)

            // deposit committed
            toDelegator.delegateNewTokens(from: <- transferVault)

            // update snapshot
            DelegatorManager.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: fromDelegator.nodeID, delegatorID: fromDelegator.id)
            DelegatorManager.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: toDelegator.nodeID, delegatorID: toDelegator.id)

            emit StrategyTransferCommittedTokens(from: fromNodeID, to: toNodeID, amount: amount)
        }

        /// Process unstaking request from the given delegator
        ///
        /// Flow chain's underlying requestUnstaking() will first unstake from committed tokens, if any.
        /// Unlike requestUnstaking(), this function will first unstake as many as possible from staked tokens instead of committed tokens
        /// It's used by off-chain bots to implement different unstaking strategies.
        access(all) fun processUnstakeRequest(requestUnstakeAmount: UFix64, delegatorUUID: UInt64) {
            pre {
                FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot process unstake request until protocol epoch syncs"
                DelegatorManager.requestedToUnstake > 0.0: "No pending unstake request to handle"
            }
            let delegator = DelegatorManager.borrowManagedDelegator(uuid: delegatorUUID)!
            let delegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: delegator.nodeID, delegatorID: delegator.id)
            let tokensStakedLeft = delegatorInfo.tokensStaked - delegatorInfo.tokensRequestedToUnstake
            let tokensCommitted = delegatorInfo.tokensCommitted

            var unstakeAmount = requestUnstakeAmount
            // Try unstaking all
            if unstakeAmount == UFix64.max {
                if DelegatorManager.requestedToUnstake >= tokensStakedLeft + tokensCommitted {
                    unstakeAmount = tokensStakedLeft + tokensCommitted
                } else {
                    unstakeAmount = DelegatorManager.requestedToUnstake
                }
            }

            assert(DelegatorManager.requestedToUnstake >= unstakeAmount, message: "Handle unstake requests out of limit")

            // Request unstaking
            if unstakeAmount <= tokensStakedLeft {
                // Consuming only from staked tokens as it's enough to cover unstaking request
                // Due to flowchain's underlying staking mechanism & api, below implementation has to be as it is: first requestUnstaking and then stake back.
                delegator.requestUnstaking(amount: unstakeAmount + tokensCommitted)
                // stake committed tokens back
                let committedVault <- delegator.withdrawUnstakedTokens(amount: tokensCommitted)
                delegator.delegateNewTokens(from: <- committedVault)
            } else {
                // Consuming all staked tokens and any rest from committed tokens
                delegator.requestUnstaking(amount: tokensStakedLeft + tokensCommitted)
                // stake remaining committed tokens back
                let committedVault <- delegator.withdrawUnstakedTokens(amount: tokensStakedLeft + tokensCommitted - unstakeAmount)
                delegator.delegateNewTokens(from: <- committedVault)
            }

            // update unprocessed unstaked requests
            DelegatorManager.requestedToUnstake = DelegatorManager.requestedToUnstake - unstakeAmount

            // update snapshot
            DelegatorManager.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: delegator.nodeID, delegatorID: delegator.id)

            emit StrategyProcessUnstakeRequest(amount: requestUnstakeAmount, nodeIDToUnstake: delegator.nodeID, delegatorIDToUnstake: delegator.id, leftoverAmount: DelegatorManager.requestedToUnstake)
        }

        /// Clean empty migrated delegator and outdated approved delegator
        access(all) fun cleanDelegators(delegatorUUID: UInt64) {
            pre {
                FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot cleanup delegators until protocol epoch syncs"
            }
            let delegator = DelegatorManager.borrowManagedDelegator(uuid: delegatorUUID)!
            let nodeID = delegator.nodeID
            let delegatorID = delegator.id
            let delegatorInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)

            assert(
                delegatorInfo.tokensCommitted +
                delegatorInfo.tokensStaked +
                delegatorInfo.tokensUnstaking +
                delegatorInfo.tokensRewarded +
                delegatorInfo.tokensUnstaked +
                delegatorInfo.tokensRequestedToUnstake
                ==
                0.0, message: "Please clean up before deleting"
            )

            var removed = false
            // remove migrated delegator
            if DelegatorManager.migratedDelegatorIDs.containsKey(nodeID) {
                if DelegatorManager.migratedDelegatorIDs[nodeID]!.containsKey(delegatorID) {
                    DelegatorManager.migratedDelegatorIDs[nodeID]!.remove(key: delegatorID)
                    DelegatorManager.removeManagedDelegator(uuid: delegatorUUID)
                    DelegatorManager.borrowCurrentQuoteEpochSnapshot().removeDelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
                    removed = true
                }
            }
            // remove old approved delegator
            if DelegatorManager.approvedDelegatorIDs.containsKey(nodeID) {
                if DelegatorManager.approvedDelegatorIDs[nodeID]! == delegatorUUID {
                    if DelegatorManager.approvedNodeIDList.containsKey(nodeID) == false {
                        DelegatorManager.approvedDelegatorIDs.remove(key: nodeID)
                        DelegatorManager.removeManagedDelegator(uuid: delegatorUUID)
                        DelegatorManager.borrowCurrentQuoteEpochSnapshot().removeDelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)
                        removed = true
                    }
                }
            }

            if removed {
                emit DelegatorRemoved(nodeID: nodeID, delegatorID: delegatorID, uuid: delegatorUUID)
            }
        }

        // Compound rewards collected in previous protocol epoch
        access(all) fun compoundRewards() {
            pre {
                FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot compound until protocol epoch syncs"
            }
            DelegatorManager.compoundRewards()
        }
    }

    /// Protocol Admin
    access(all) resource Admin {

        /// Initialize approved staking node list
        access(all) fun initApprovedNodeIDList(nodeIDs: {String: UFix64}, defaultNodeIDToStake: String) {
            pre {
                nodeIDs.containsKey(defaultNodeIDToStake): "Default staking node id must be in the list"
                DelegatorManager.approvedNodeIDList.length == 0: "Can only be initialized once"
            }
            for id in nodeIDs.keys {
                DelegatorManager.approvedNodeIDList.insert(key: id, nodeIDs[id]!)
            }
            DelegatorManager.defaultNodeIDToStake = defaultNodeIDToStake

            emit SetApprovedNodeList(nodeIDs: nodeIDs, defaultNodeIDToStake: defaultNodeIDToStake)
        }

        access(all) fun upsertApprovedNodeID(nodeID: String, weight: UFix64) {
            let oldWeight = DelegatorManager.approvedNodeIDList.insert(key: nodeID, weight)

            emit UpsertApprovedNode(nodeID: nodeID, oldWeight: oldWeight, newWeight: weight)
        }

        access(all) fun removeApprovedNodeID(nodeID: String) {
            DelegatorManager.removeApprovedNodeID(nodeID: nodeID)

            emit ApprovedNodeRemoved(nodeID: nodeID)
        }
        
        /// Select a node among approved node list to be the default staking node
        /// Delegation strategy will distribute its commited tokens to other staking nodes
        access(all) fun setDefaultNodeIDToStake(nodeID: String) {
            pre {
                DelegatorManager.approvedNodeIDList.containsKey(nodeID): "Default staking node id must be in approved node list"
            }
            if nodeID != DelegatorManager.defaultNodeIDToStake {
                DelegatorManager.defaultNodeIDToStake = nodeID
                emit SetDefaultStakeNode(from: DelegatorManager.defaultNodeIDToStake, to: nodeID)
            }
        }

        /// Create Strategy
        access(all) fun createStrategy(): @DelegationStrategy {
            return <- create DelegationStrategy()
        }

        /// Redelegate @amount of staked $Flow, @amount doesn't include committed $Flow. Due to flowchain's underlying staking mechanism:
        ///  - committed tokens can be immediately canceled and restaked
        ///  - staked $Flow will be in unstaking mode in the next chain epoch and become unstaked (and available for restake) in next+1 chain epoch
        access(all) fun redelegate(nodeID: String, delegatorID: UInt32, amount: UFix64) {
            pre {
                FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: "Cannot redelegate until protocol epoch syncs"
            }
            let uuid = DelegatorManager.getDelegatorUUIDByID(nodeID: nodeID, delegatorID: delegatorID)!
            let delegator = DelegatorManager.borrowManagedDelegator(uuid: uuid)!
            let delegatorInfo = DelegatorManager.getDelegatorInfoByUUID(delegatorUUID: uuid)

            // cancel and restake any committed tokens directly
            let redelegateCommittedAmount = delegatorInfo.tokensCommitted
            if redelegateCommittedAmount > 0.0 {
                delegator.requestUnstaking(amount: redelegateCommittedAmount)
                let committedVault <- delegator.withdrawUnstakedTokens(amount: redelegateCommittedAmount)
                DelegatorManager.depositToCommitted(flowVault: <-(committedVault as! @FlowToken.Vault))
            }

            // request to unstake
            delegator.requestUnstaking(amount: amount)

            DelegatorManager.borrowCurrentQuoteEpochSnapshot().addRedelegatedTokensRequestToUnstake(amount: amount)
            // update snapshotted delegator info
            DelegatorManager.borrowCurrentQuoteEpochSnapshot().upsertDelegatorInfo(nodeID: delegator.nodeID, delegatorID: delegator.id)

            emit RedelegateRequested(nodeID: nodeID, delegatorID: delegatorID, redelegateCommittedAmount: redelegateCommittedAmount, redelegateRequestToUnstake: amount)
        }

        /// Protocol fee vault control
        access(all) fun borrowProtocolFeeVault(): &FlowToken.Vault {
            return &DelegatorManager.protocolFeeVault as &FlowToken.Vault
        }

        /// Manually register a new delegator resource on the given approved node
        access(all) fun registerApprovedDelegator(nodeID: String, initialCommit: @FungibleToken.Vault) {
            DelegatorManager.registerApprovedDelegator(nodeID, <-initialCommit)
        }
    }

    init() {
        self.adminPath = /storage/liquidStakingAdmin
        self.delegationStrategyPath = /storage/liquidStakingDelegationStrategy

        self.approvedNodeIDList = {}
        self.defaultNodeIDToStake = ""

        self.allDelegators <- {}
        self.approvedDelegatorIDs = {}
        self.migratedDelegatorIDs = {}

        self.requestedToUnstake = 0.0
        self.protocolFeeVault <- FlowToken.createEmptyVault() as! @FlowToken.Vault
        self.totalUnstakedVault <- FlowToken.createEmptyVault() as! @FlowToken.Vault
        self.totalRewardedVault <- FlowToken.createEmptyVault() as! @FlowToken.Vault

        self.quoteEpochCounter = 0
        self.epochSnapshotHistory = {}
        self.epochSnapshotHistory[0] = EpochSnapshot(epochCounter: 0)

        self._reservedFields = {}

        self.account.save(<-create Admin(), to: self.adminPath)
    }
}