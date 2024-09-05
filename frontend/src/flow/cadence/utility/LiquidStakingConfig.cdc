/**

# Liquid staking config

# Author: Increment Labs

*/

import FlowIDTableStaking from "./FlowIDTableStaking.cdc"

access(all) contract LiquidStakingConfig {

    /// Minimum limit of staking
    access(all) var minStakingAmount: UFix64

    /// Pauses
    access(all) var isStakingPaused: Bool
    access(all) var isUnstakingPaused: Bool
    access(all) var isMigratingPaused: Bool

    /// Max staking amount
    access(all) var stakingCap: UFix64

    // Windows size before auction stage end, left for bots to handle unstaking requests
    access(all) var windowSizeBeforeStakingEnd: UInt64

    /// Fee of quick unstaking from reserved committed vault
    access(all) var quickUnstakeFee: UFix64

    /// Cut of staking interests reserved as protocol fees
    access(all) var protocolFee: UFix64

    /// Scale factor applied to fixed point number calculation.
    /// Note: The use of scale factor is due to fixed point number in cadence is only precise to 1e-8:
    /// https://docs.onflow.org/cadence/language/values-and-types/#fixed-point-numbers
    access(all) let scaleFactor: UInt256

    /// 100_000_000.0, i.e. 1.0e8
    access(all) let ufixScale: UFix64

    access(all) let adminPath: StoragePath

    /// events
    access(all) event ConfigMinStakingAmount(newValue: UFix64, oldValue: UFix64)
    access(all) event ConfigStakingCap(newValue: UFix64, oldValue: UFix64)
    access(all) event ConfigStakingPause(newValue: Bool, oldValue: Bool)
    access(all) event ConfigUnstakingPause(newValue: Bool, oldValue: Bool)
    access(all) event ConfigMigratingPause(newValue: Bool, oldValue: Bool)
    access(all) event ConfigQuickUnstakeFee(newValue: UFix64, oldValue: UFix64)
    access(all) event ConfigProtocolFee(newValue: UFix64, oldValue: UFix64)
    access(all) event ConfigWindowSize(newValue: UInt64, oldValue: UInt64)

    /// Reserved parameter fields: {ParamName: Value}
    access(self) let _reservedFields: {String: AnyStruct}

    access(all) fun calcEstimatedStakingPayout(stakedAmount: UFix64): UFix64 {
        let scaledStakedAmount = self.UFix64ToScaledUInt256(stakedAmount)
        let scaledSystemTotalStaked = self.UFix64ToScaledUInt256(FlowIDTableStaking.getTotalStaked())
        let scaledEpochTokenPayout = self.UFix64ToScaledUInt256(FlowIDTableStaking.getEpochTokenPayout())

        if scaledSystemTotalStaked == 0 {
            return 0.0
        }

        var scaledRewardAmount = scaledStakedAmount * scaledEpochTokenPayout / scaledSystemTotalStaked
        let scaledNodeCutAmount = scaledRewardAmount * self.UFix64ToScaledUInt256(FlowIDTableStaking.getRewardCutPercentage()) / self.scaleFactor
        // Deducting node cut
        scaledRewardAmount = scaledRewardAmount - scaledNodeCutAmount

        let scaledProtocolCutAmount = scaledRewardAmount * self.UFix64ToScaledUInt256(self.protocolFee) / self.scaleFactor
        // Deducting protocol fees
        scaledRewardAmount = scaledRewardAmount - scaledProtocolCutAmount

        return self.ScaledUInt256ToUFix64(scaledRewardAmount)
    }

    /// Utility function to convert a UFix64 number to its scaled equivalent in UInt256 format
    /// e.g. 184467440737.09551615 (UFix64.max) => 184467440737095516150000000000
    ///
    access(all) fun UFix64ToScaledUInt256(_ f: UFix64): UInt256 {
        let integral = UInt256(f)
        let fractional = f % 1.0
        let ufixScaledInteger =  integral * UInt256(self.ufixScale) + UInt256(fractional * self.ufixScale)
        return ufixScaledInteger * self.scaleFactor / UInt256(self.ufixScale)
    }

    /// Utility function to convert a fixed point number in form of scaled UInt256 back to UFix64 format
    /// e.g. 184467440737095516150000000000 => 184467440737.09551615
    ///
    access(all) fun ScaledUInt256ToUFix64(_ scaled: UInt256): UFix64 {
        let integral = scaled / self.scaleFactor
        let ufixScaledFractional = (scaled % self.scaleFactor) * UInt256(self.ufixScale) / self.scaleFactor
        return UFix64(integral) + (UFix64(ufixScaledFractional) / self.ufixScale)
    }

    /// Config Admin
    ///
    access(all) resource Admin {

        access(all) fun setMinStakingAmount(minStakingAmount: UFix64) {
            emit ConfigMinStakingAmount(newValue: minStakingAmount, oldValue: LiquidStakingConfig.minStakingAmount)
            LiquidStakingConfig.minStakingAmount = minStakingAmount
        }

        access(all) fun setStakingCap(stakingCap: UFix64) {
            emit ConfigStakingCap(newValue: stakingCap, oldValue: LiquidStakingConfig.stakingCap)
            LiquidStakingConfig.stakingCap = stakingCap
        }

        access(all) fun setQuickUnstakeFee(quickUnstakeFee: UFix64) {
            pre {
                quickUnstakeFee < 1.0: "Invalid quick unstake fee"
            }
            emit ConfigQuickUnstakeFee(newValue: quickUnstakeFee, oldValue: LiquidStakingConfig.quickUnstakeFee)
            LiquidStakingConfig.quickUnstakeFee = quickUnstakeFee
        }

        access(all) fun setProtocolFee(protocolFee: UFix64) {
            pre {
                protocolFee < 1.0: "Invalid protocol fee"
            }
            emit ConfigProtocolFee(newValue: protocolFee, oldValue: LiquidStakingConfig.protocolFee)
            LiquidStakingConfig.protocolFee = protocolFee
        }

        access(all) fun setPause(stakingPause: Bool, unstakingPause: Bool, migratingPause: Bool) {
            if LiquidStakingConfig.isStakingPaused != stakingPause {
                emit ConfigStakingPause(newValue: stakingPause, oldValue: LiquidStakingConfig.isStakingPaused)
                LiquidStakingConfig.isStakingPaused = stakingPause
            }

            if LiquidStakingConfig.isUnstakingPaused != unstakingPause {
                emit ConfigUnstakingPause(newValue: unstakingPause, oldValue: LiquidStakingConfig.isUnstakingPaused)
                LiquidStakingConfig.isUnstakingPaused = unstakingPause
            }
            if LiquidStakingConfig.isMigratingPaused != migratingPause {
                emit ConfigMigratingPause(newValue: migratingPause, oldValue: LiquidStakingConfig.isMigratingPaused)
                LiquidStakingConfig.isMigratingPaused = migratingPause
            }
        }

        access(all) fun setWindowSize(windowSize: UInt64) {
            emit ConfigWindowSize(newValue: windowSize, oldValue: LiquidStakingConfig.windowSizeBeforeStakingEnd)
            LiquidStakingConfig.windowSizeBeforeStakingEnd = windowSize
        }
    }

    init() {
        self.minStakingAmount = 0.1            // 0.1 flow
        self.stakingCap = 150_000.0            // 150K flow initial cap
        self.quickUnstakeFee = 0.003           // 0.3%
        self.protocolFee = 0.01                // 1%
        self.windowSizeBeforeStakingEnd = 400  // 400 block views, about 10 mins

        self.isStakingPaused = false
        self.isUnstakingPaused = false
        self.isMigratingPaused = false

        /// 1e18
        self.scaleFactor = 1_000_000_000_000_000_000
        /// 1.0e8
        self.ufixScale = 100_000_000.0

        self.adminPath = /storage/liquidStakingConfigAdmin

        self._reservedFields = {}

        self.account.save(<-create Admin(), to: self.adminPath)
    }
}