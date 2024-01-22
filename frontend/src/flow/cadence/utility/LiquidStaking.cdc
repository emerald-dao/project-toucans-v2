/**

# Liquid Staking

# Author: Increment Labs

*/

import FlowToken from "./FlowToken.cdc"
import stFlowToken from "./stFlowToken.cdc"

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
        let flowAmountToStake = flowVault.balance
        let stFlowAmountToMint = self.calcStFlowFromFlow(flowAmount: flowAmountToStake)
        destroy flowVault


        // Mint stFlow
        let stFlowVault <- stFlowToken.mintTokens(amount: stFlowAmountToMint)

        return <-stFlowVault
    }

    /// To unstake (normally) that needs to wait for several epochs before finally withdrawing $flow (principal + interests) from the protocol
    /// Returns a ticket indicating the amount of $flow redeemable after certain protocol epoch (so you won't get $flow back immediately)
    pub fun unstake(stFlowVault: @stFlowToken.Vault): @WithdrawVoucher {
        let stFlowAmountToBurn = stFlowVault.balance
        let flowAmountToUnstake = self.calcFlowFromStFlow(stFlowAmount: stFlowAmountToBurn)

        // Burn stFlow
        stFlowToken.burnTokens(from: <-stFlowVault)


        let currentBlockView = getCurrentBlock().view

        // In most of the time, the voucher will be redeemable after 2 protocol epochs
        var unlockEpoch: UInt64 = 1 + 2

        let unstakeVoucher <- create WithdrawVoucher(
            lockedFlowAmount: flowAmountToUnstake,
            unlockEpoch: unlockEpoch
        )

        emit Unstake(stFlowAmountIn: stFlowAmountToBurn, lockedFlowAmount: flowAmountToUnstake, currProtocolEpoch: 3, unlockProtocolEpoch: unlockEpoch, voucherUUID: unstakeVoucher.uuid)

        return <- unstakeVoucher
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
        return 10.0
    }

    /// Calculate exchange amount from stFlow to Flow
    pub fun calcFlowFromStFlow(stFlowAmount: UFix64): UFix64 {
       return 10.0
    }

    init() {
        self.WithdrawVoucherCollectionPath = /storage/liquid_staking_withdraw_voucher_collection
        self.WithdrawVoucherCollectionPublicPath = /public/liquid_staking_withdraw_voucher_collection
        self._reservedFields = {}
    }
}