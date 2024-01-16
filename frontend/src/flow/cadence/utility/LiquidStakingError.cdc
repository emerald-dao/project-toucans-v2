/**

# Common liquid staking errors

# Author: Increment Labs

*/
pub contract LiquidStakingError {

    pub enum ErrorCode: UInt8 {
        pub case NO_ERROR
        pub case INVALID_PARAMETERS
        pub case STAKING_REWARD_NOT_PAID
        pub case EXCEED_STAKE_CAP
        pub case STAKE_NOT_OPEN
        pub case UNSTAKE_NOT_OPEN
        pub case MIGRATE_NOT_OPEN
        pub case STAKING_AUCTION_NOT_IN_PROGRESS
        pub case QUOTE_EPOCH_EXPIRED
        pub case CANNOT_CASHOUT_WITHDRAW_VOUCHER
    }

    pub fun ErrorEncode(msg: String, err: ErrorCode): String {
        return "[IncLiquidStakingErrorMsg:".concat(msg).concat("]").concat(
               "[IncLiquidStakingErrorCode:").concat(err.rawValue.toString()).concat("]")
    }
}