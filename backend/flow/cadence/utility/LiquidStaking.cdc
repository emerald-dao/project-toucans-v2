/**

# Liquid Staking

# Author: Increment Labs

*/

import FlowToken from "./FlowToken.cdc"
import stFlowToken from "./stFlowToken.cdc"

access(all) contract LiquidStaking {

    /// Paths
    access(all) let WithdrawVoucherCollectionPath: StoragePath
    access(all) let WithdrawVoucherCollectionPublicPath: PublicPath

    /// Events
    access(all) event Stake(flowAmountIn: UFix64, stFlowAmountOut: UFix64, currProtocolEpoch: UInt64)
    access(all) event Unstake(stFlowAmountIn: UFix64, lockedFlowAmount: UFix64, currProtocolEpoch: UInt64, unlockProtocolEpoch: UInt64, voucherUUID: UInt64)
    access(all) event UnstakeQuickly(stFlowAmountIn: UFix64, flowAmountOut: UFix64, currProtocolEpoch: UInt64)
    access(all) event MigrateDelegator(uuid: UInt64, migratedFlowIn: UFix64, stFlowOut: UFix64)
    access(all) event BurnWithdrawVoucher(uuid: UInt64, amountFlowCashedout: UFix64, currProtocolEpoch: UInt64)

    /// Reserved parameter fields: {ParamName: Value}
    access(self) let _reservedFields: {String: AnyStruct}

    /// A voucher indicating the amount of locked $flow will be redeemable after certain protocol epoch (inclusive)
    access(all) resource WithdrawVoucher {

        /// Flow token amount to be unlocked
        access(all) let lockedFlowAmount: UFix64

        /// Unlock epoch
        access(all) let unlockEpoch: UInt64

        init(lockedFlowAmount: UFix64, unlockEpoch: UInt64) {
            self.lockedFlowAmount = lockedFlowAmount
            self.unlockEpoch = unlockEpoch
        }
    }

    /// Deposit and stake $flow in exchange for $stFlow token
    access(all) fun stake(flowVault: @FlowToken.Vault): @stFlowToken.Vault {

        let flowAmountToStake = flowVault.balance
        let stFlowAmountToMint = self.calcStFlowFromFlow(flowAmount: flowAmountToStake)

        // Stake to committed tokens
        // DelegatorManager.depositToCommitted(flowVault: <-flowVault)

        // Mint stFlow
        destroy flowVault
        let stFlowVault <- stFlowToken.mintTokens(amount: stFlowAmountToMint)

        // emit Stake(flowAmountIn: flowAmountToStake, stFlowAmountOut: stFlowAmountToMint, currProtocolEpoch: )

        return <-stFlowVault
    }

    /// WithdrawVoucher collection
    access(all) resource interface WithdrawVoucherCollectionPublic {
        access(all) fun getVoucherInfos(): [AnyStruct]
        access(all) fun deposit(voucher: @WithdrawVoucher)
    }

    access(all) resource WithdrawVoucherCollection: WithdrawVoucherCollectionPublic {
        /// A list of withdraw vouchers
        access(self) var vouchers: @[WithdrawVoucher]

        access(all) fun deposit(voucher: @WithdrawVoucher) {
            self.vouchers.append(<-voucher)
        }

        access(all) fun withdraw(uuid: UInt64): @WithdrawVoucher {
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

        access(all) fun getVoucherInfos(): [AnyStruct] {
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
    }

    access(all) fun createEmptyWithdrawVoucherCollection(): @WithdrawVoucherCollection {
        return <-create WithdrawVoucherCollection()
    }

    /// Calculate exchange amount from Flow to stFlow
    access(all) fun calcStFlowFromFlow(flowAmount: UFix64): UFix64 {
        // let currentEpochSnapshot = DelegatorManager.borrowCurrentQuoteEpochSnapshot()
        // let scaledFlowPrice = currentEpochSnapshot.scaledQuoteFlowStFlow
        // let scaledFlowAmount = LiquidStakingConfig.UFix64ToScaledUInt256(flowAmount)

        // let stFlowAmount = LiquidStakingConfig.ScaledUInt256ToUFix64(
        //     scaledFlowPrice * scaledFlowAmount / LiquidStakingConfig.scaleFactor
        // )
        return flowAmount
    }

    /// Calculate exchange amount from stFlow to Flow
    access(all) fun calcFlowFromStFlow(stFlowAmount: UFix64): UFix64 {
        // let currentEpochSnapshot = DelegatorManager.borrowCurrentQuoteEpochSnapshot()
        // let scaledStFlowPrice = currentEpochSnapshot.scaledQuoteStFlowFlow
        // let scaledStFlowAmount = LiquidStakingConfig.UFix64ToScaledUInt256(stFlowAmount)

        // let flowAmount = LiquidStakingConfig.ScaledUInt256ToUFix64(
        //     scaledStFlowPrice * scaledStFlowAmount / LiquidStakingConfig.scaleFactor
        // )
        return stFlowAmount
    }

    init() {
        self.WithdrawVoucherCollectionPath = /storage/liquid_staking_withdraw_voucher_collection
        self.WithdrawVoucherCollectionPublicPath = /public/liquid_staking_withdraw_voucher_collection
        self._reservedFields = {}
    }
}