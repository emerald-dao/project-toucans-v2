/**

# Liquid Staking

# Author: Increment Labs

*/

import FlowToken from "./FlowToken.cdc"

import FlowIDTableStaking from "./FlowIDTableStaking.cdc"
import FlowEpoch from "./FlowEpoch.cdc"

import stFlowToken from "./stFlowToken.cdc"
import LiquidStakingConfig from "./LiquidStakingConfig.cdc"
import LiquidStakingError from "./LiquidStakingError.cdc"
import DelegatorManager from "./DelegatorManager.cdc"

pub contract LiquidStaking {

    /// Paths
    pub let WithdrawVoucherCollectionPath: StoragePath
    pub let WithdrawVoucherCollectionPublicPath: PublicPath

    /// Events
    pub event Stake(flowAmountIn: UFix64, stFlowAmountOut: UFix64, currProtocolEpoch: UInt64)
    pub event Unstake(stFlowAmountIn: UFix64, lockedFlowAmount: UFix64, currProtocolEpoch: UInt64, unlockProtocolEpoch: UInt64, voucherUUID: UInt64)
    pub event UnstakeQuickly(stFlowAmountIn: UFix64, flowAmountOut: UFix64, currProtocolEpoch: UInt64)
    pub event MigrateDelegator(uuid: UInt64, migratedFlowIn: UFix64, stFlowOut: UFix64)
    pub event BurnWithdrawVoucher(uuid: UInt64, amountFlowCashedout: UFix64, currProtocolEpoch: UInt64)

    /// Reserved parameter fields: {ParamName: Value}
    access(self) let _reservedFields: {String: AnyStruct}

    /// A voucher indicating the amount of locked $flow will be redeemable after certain protocol epoch (inclusive)
    pub resource WithdrawVoucher {

        /// Flow token amount to be unlocked
        pub let lockedFlowAmount: UFix64

        /// Unlock epoch
        pub let unlockEpoch: UInt64

        init(lockedFlowAmount: UFix64, unlockEpoch: UInt64) {
            self.lockedFlowAmount = lockedFlowAmount
            self.unlockEpoch = unlockEpoch
        }
    }

    /// Deposit and stake $flow in exchange for $stFlow token
    pub fun stake(flowVault: @FlowToken.Vault): @stFlowToken.Vault {
        pre {
            // Pause check
            LiquidStakingConfig.isStakingPaused == false: LiquidStakingError.ErrorEncode(msg: "Staking is paused", err: LiquidStakingError.ErrorCode.STAKE_NOT_OPEN)
            // Flow blockchain staking state check
            FlowIDTableStaking.stakingEnabled(): LiquidStakingError.ErrorEncode(msg: "Cannot stake as not in flowchain's staking auction period", err: LiquidStakingError.ErrorCode.STAKING_AUCTION_NOT_IN_PROGRESS)
            // Protocol epoch sync check
            FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: LiquidStakingError.ErrorEncode(msg: "Cannot stake until protocol epoch syncs with chain epoch", err: LiquidStakingError.ErrorCode.QUOTE_EPOCH_EXPIRED)
            // Min staking amount check
            flowVault.balance >= LiquidStakingConfig.minStakingAmount: LiquidStakingError.ErrorEncode(msg: "Stake amount must be greater than ".concat(LiquidStakingConfig.minStakingAmount.toString()), err: LiquidStakingError.ErrorCode.INVALID_PARAMETERS)
            // Staking amount cap check
            LiquidStakingConfig.stakingCap >= flowVault.balance + DelegatorManager.getTotalValidStakingAmount(): LiquidStakingError.ErrorEncode(msg: "Exceed stake cap: ".concat(LiquidStakingConfig.stakingCap.toString()), err: LiquidStakingError.ErrorCode.EXCEED_STAKE_CAP)
        }

        let flowAmountToStake = flowVault.balance
        let stFlowAmountToMint = self.calcStFlowFromFlow(flowAmount: flowAmountToStake)

        // Stake to committed tokens
        DelegatorManager.depositToCommitted(flowVault: <-flowVault)

        // Mint stFlow
        let stFlowVault <- stFlowToken.mintTokens(amount: stFlowAmountToMint)

        emit Stake(flowAmountIn: flowAmountToStake, stFlowAmountOut: stFlowAmountToMint, currProtocolEpoch: DelegatorManager.quoteEpochCounter)

        return <-stFlowVault
    }

    /// To unstake (normally) that needs to wait for several epochs before finally withdrawing $flow (principal + interests) from the protocol
    /// Returns a ticket indicating the amount of $flow redeemable after certain protocol epoch (so you won't get $flow back immediately)
    pub fun unstake(stFlowVault: @stFlowToken.Vault): @WithdrawVoucher {
        pre {
            // Pause check
            LiquidStakingConfig.isUnstakingPaused == false: LiquidStakingError.ErrorEncode(msg: "Unstaking is paused", err: LiquidStakingError.ErrorCode.UNSTAKE_NOT_OPEN)
            // Unstaking amount check
            stFlowVault.balance > 0.0: LiquidStakingError.ErrorEncode(msg: "Unstake amount must be greater than 0.0", err: LiquidStakingError.ErrorCode.INVALID_PARAMETERS)
        }

        let stFlowAmountToBurn = stFlowVault.balance
        let flowAmountToUnstake = self.calcFlowFromStFlow(stFlowAmount: stFlowAmountToBurn)

        // Burn stFlow
        stFlowToken.burnTokens(from: <-stFlowVault)

        // Request unstake from staked & committed tokens
        DelegatorManager.requestWithdrawFromStaked(amount: flowAmountToUnstake)

        let currentBlockView = getCurrentBlock().view
        let stakingEndView = FlowEpoch.getEpochMetadata(FlowEpoch.currentEpochCounter)!.stakingEndView
        let protocolEpoch = DelegatorManager.quoteEpochCounter

        // In most of the time, the voucher will be redeemable after 2 protocol epochs
        var unlockEpoch = protocolEpoch + 2
        if FlowEpoch.currentEpochCounter > DelegatorManager.quoteEpochCounter {
            // If unstake() happenes in the short period of time that chain epoch has advanced already but the protocol is waiting to collect 
            // delegators and update $stFlow price. For safety purpose the unlockEpoch is postponed for an additional epoch
            unlockEpoch = protocolEpoch + 3
        } else  {
            if FlowIDTableStaking.stakingEnabled() == false {
                // Otherwise if unstake() happenes in flowchain's epoch setup & commit stage, no "real" action is allowed in the underlying layer
                // So for safety purpose it's postponed for an extra epoch, too
                // In this case the waiting time <= (2 epochs + epoch setup & commit time). Epoch setup & commit time usually takes less than half a day
                // See https://developers.flow.com/nodes/staking/schedule#schedule for more details
                unlockEpoch = protocolEpoch + 3
            } else if currentBlockView + LiquidStakingConfig.windowSizeBeforeStakingEnd > stakingEndView {
                // Before staking auction ends, a window of processing time is reserved to handle unprocessed unstake requests
                // Any unstake() happening within this short period of time will be postponed with an extra epoch for safety purpose
                // However, even in this case the waiting time <= (2 epochs + safetyWindowSize)
                unlockEpoch = protocolEpoch + 3
            }
        }

        let unstakeVoucher <- create WithdrawVoucher(
            lockedFlowAmount: flowAmountToUnstake,
            unlockEpoch: unlockEpoch
        )

        emit Unstake(stFlowAmountIn: stFlowAmountToBurn, lockedFlowAmount: flowAmountToUnstake, currProtocolEpoch: protocolEpoch, unlockProtocolEpoch: unlockEpoch, voucherUUID: unstakeVoucher.uuid)

        return <- unstakeVoucher
    }

    /// To unstake (quickly) from liquid staking protocol's default staking node, without waiting for several epochs
    /// You'll immediately get $flow back, as long as the default staking node has enough newly committed tokens from this epoch; otherwise reverts internally.
    pub fun unstakeQuickly(stFlowVault: @stFlowToken.Vault): @FlowToken.Vault {
        pre {
            // Pause check
            LiquidStakingConfig.isUnstakingPaused == false: LiquidStakingError.ErrorEncode(msg: "Unstaking is paused", err: LiquidStakingError.ErrorCode.UNSTAKE_NOT_OPEN)
            // Flow chain unstaking state check
            FlowIDTableStaking.stakingEnabled(): LiquidStakingError.ErrorEncode(msg: "Cannot unstake as not in flowchain's staking auction period", err: LiquidStakingError.ErrorCode.STAKING_AUCTION_NOT_IN_PROGRESS)
            // Protocol epoch sync check
            FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: LiquidStakingError.ErrorEncode(msg: "Cannot unstake until protocol epoch syncs with chain epoch", err: LiquidStakingError.ErrorCode.QUOTE_EPOCH_EXPIRED)
            // Unstaking amount check
            stFlowVault.balance > 0.0: LiquidStakingError.ErrorEncode(msg: "Unstake amount must be greater than 0.0", err: LiquidStakingError.ErrorCode.INVALID_PARAMETERS)
        }

        let stFlowAmountToBurn = stFlowVault.balance
        let flowAmountToUnstake = self.calcFlowFromStFlow(stFlowAmount: stFlowAmountToBurn)

        // Burn stFlow
        stFlowToken.burnTokens(from: <-stFlowVault)

        // Withdraw from default staking node's committed vault
        let flowVault <- DelegatorManager.withdrawFromCommitted(amount: flowAmountToUnstake)

        // Deduct fast unstake protocol fee
        let feeVault <- flowVault.withdraw(amount: LiquidStakingConfig.quickUnstakeFee * flowAmountToUnstake)
        DelegatorManager.depositToProtocolFees(flowVault: <-feeVault, purpose: "fast unstake fee -> protocol fee")

        emit UnstakeQuickly(stFlowAmountIn: stFlowAmountToBurn, flowAmountOut: flowVault.balance, currProtocolEpoch: DelegatorManager.quoteEpochCounter)

        return <-flowVault
    }

    /// Cashout WithdrawVoucher by burning it for FlowToken
    pub fun cashoutWithdrawVoucher(voucher: @WithdrawVoucher): @FlowToken.Vault {
        pre {
            DelegatorManager.quoteEpochCounter >= voucher.unlockEpoch: LiquidStakingError.ErrorEncode(msg: "Voucher is not redeemable yet", err: LiquidStakingError.ErrorCode.CANNOT_CASHOUT_WITHDRAW_VOUCHER)
        }
        let cashoutAmount = voucher.lockedFlowAmount

        let flowVault <-DelegatorManager.withdrawFromUnstaked(amount: cashoutAmount)

        emit BurnWithdrawVoucher(uuid: voucher.uuid, amountFlowCashedout: cashoutAmount, currProtocolEpoch: DelegatorManager.quoteEpochCounter)

        destroy voucher

        return <-flowVault
    }

    /// Migrate staked NodeDelegator resources to get it managed by the liquid staking protocol, and mint corresponding $stFlow back
    /// This is a useful feature for users who have already staked $flow to nodes. To get the benefits of $stFlow and its ecosystem, they do not have to
    /// first unstake from nodes (as it usually takes 1~2 epochs and lose staking rewards meanwhile); users can just migrate their NodeDelegator resources
    /// (represents their staked positions) in and get $stFlow immediately.
    pub fun migrate(delegator: @FlowIDTableStaking.NodeDelegator): @stFlowToken.Vault {
        pre {
            // Pause check
            LiquidStakingConfig.isMigratingPaused == false: LiquidStakingError.ErrorEncode(msg: "Migrating is paused", err: LiquidStakingError.ErrorCode.MIGRATE_NOT_OPEN)
            // Flowchain staking state check
            FlowIDTableStaking.stakingEnabled(): LiquidStakingError.ErrorEncode(msg: "Cannot migrate as not in flowchain's staking auction period", err: LiquidStakingError.ErrorCode.STAKING_AUCTION_NOT_IN_PROGRESS)
            // Protocol epoch sync check
            FlowEpoch.currentEpochCounter == DelegatorManager.quoteEpochCounter: LiquidStakingError.ErrorEncode(msg: "Cannot migrate until protocol epoch syncs with chain epoch", err: LiquidStakingError.ErrorCode.QUOTE_EPOCH_EXPIRED)
        }

        let delegatroInfo = FlowIDTableStaking.DelegatorInfo(nodeID: delegator.nodeID, delegatorID: delegator.id)

        assert(LiquidStakingConfig.stakingCap >= delegatroInfo.tokensStaked + DelegatorManager.getTotalValidStakingAmount(), message: "Exceed stake cap")
        assert(delegatroInfo.tokensUnstaking == 0.0, message: "Wait for the previous unstaking processing to complete")
        assert(delegatroInfo.tokensRewarded == 0.0, message: "Please claim the reward before migrating")
        assert(delegatroInfo.tokensUnstaked == 0.0, message: "Please withdraw the unstaked tokens before migrating")
        assert(delegatroInfo.tokensRequestedToUnstake == 0.0, message: "Please cancel the unstake requests before migrating")
        assert(delegatroInfo.tokensCommitted == 0.0, message: "Please cancel the stake requests before migrating")
        assert(delegatroInfo.tokensStaked > 0.0, message: "No staked tokens need to be migrated.")

        let stakedFlowToMigrate = delegatroInfo.tokensStaked
        let stFlowAmountToMint = self.calcStFlowFromFlow(flowAmount: stakedFlowToMigrate)

        emit MigrateDelegator(uuid: delegator.uuid, migratedFlowIn: stakedFlowToMigrate, stFlowOut: stFlowAmountToMint)

        // Migrate NodeDelegator resource to make it managed by the liquid staking protocol
        DelegatorManager.migrateDelegator(delegator: <-delegator)

        // Mint stFlow
        return <-stFlowToken.mintTokens(amount: stFlowAmountToMint)
    }


    /// WithdrawVoucher collection
    pub resource interface WithdrawVoucherCollectionPublic {
        pub fun getVoucherInfos(): [AnyStruct]
        pub fun deposit(voucher: @WithdrawVoucher)
    }

    pub resource WithdrawVoucherCollection: WithdrawVoucherCollectionPublic {
        /// A list of withdraw vouchers
        access(self) var vouchers: @[WithdrawVoucher]

        pub fun deposit(voucher: @WithdrawVoucher) {
            self.vouchers.append(<-voucher)
        }

        pub fun withdraw(uuid: UInt64): @WithdrawVoucher {
            var findIndex: Int? = nil
            var index = 0
            while index < self.vouchers.length {
                if self.vouchers[index].uuid == uuid {
                    findIndex = index
                    break
                }
                index = index + 1
            }

            assert(findIndex != nil, message: "Cannot find voucher with uuid ".concat(uuid.toString()))
            return <-self.vouchers.remove(at: findIndex!)
        }

        pub fun getVoucherInfos(): [AnyStruct] {
            var voucherInfos: [AnyStruct] = []
            var index = 0
            while index < self.vouchers.length {
                voucherInfos.append({
                    "uuid": self.vouchers[index].uuid,
                    "lockedFlowAmount": self.vouchers[index].lockedFlowAmount,
                    "unlockEpoch": self.vouchers[index].unlockEpoch
                })
                index = index + 1
            }
            return voucherInfos
        }

        init() {
            self.vouchers <- []
        }

        destroy() {
            destroy self.vouchers
        }
    }

    pub fun createEmptyWithdrawVoucherCollection(): @WithdrawVoucherCollection {
        return <-create WithdrawVoucherCollection()
    }

    /// Calculate exchange amount from Flow to stFlow
    pub fun calcStFlowFromFlow(flowAmount: UFix64): UFix64 {
        let currentEpochSnapshot = DelegatorManager.borrowCurrentQuoteEpochSnapshot()
        let scaledFlowPrice = currentEpochSnapshot.scaledQuoteFlowStFlow
        let scaledFlowAmount = LiquidStakingConfig.UFix64ToScaledUInt256(flowAmount)

        let stFlowAmount = LiquidStakingConfig.ScaledUInt256ToUFix64(
            scaledFlowPrice * scaledFlowAmount / LiquidStakingConfig.scaleFactor
        )
        return stFlowAmount
    }

    /// Calculate exchange amount from stFlow to Flow
    pub fun calcFlowFromStFlow(stFlowAmount: UFix64): UFix64 {
        let currentEpochSnapshot = DelegatorManager.borrowCurrentQuoteEpochSnapshot()
        let scaledStFlowPrice = currentEpochSnapshot.scaledQuoteStFlowFlow
        let scaledStFlowAmount = LiquidStakingConfig.UFix64ToScaledUInt256(stFlowAmount)

        let flowAmount = LiquidStakingConfig.ScaledUInt256ToUFix64(
            scaledStFlowPrice * scaledStFlowAmount / LiquidStakingConfig.scaleFactor
        )
        return flowAmount
    }

    init() {
        self.WithdrawVoucherCollectionPath = /storage/liquid_staking_withdraw_voucher_collection
        self.WithdrawVoucherCollectionPublicPath = /public/liquid_staking_withdraw_voucher_collection
        self._reservedFields = {}
    }
}