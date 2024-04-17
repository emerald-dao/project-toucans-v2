/**

# Common liquid staking errors

# Author: Increment Labs

*/
access(all) contract LiquidStakingError {

    access(all) enum ErrorCode: UInt8 {
        access(all) case NO_ERROR
        access(all) case INVALID_PARAMETERS
        access(all) case STAKING_REWARD_NOT_PAID
        access(all) case EXCEED_STAKE_CAP
        access(all) case STAKE_NOT_OPEN
        access(all) case UNSTAKE_NOT_OPEN
        access(all) case MIGRATE_NOT_OPEN
        access(all) case STAKING_AUCTION_NOT_IN_PROGRESS
        access(all) case QUOTE_EPOCH_EXPIRED
        access(all) case CANNOT_CASHOUT_WITHDRAW_VOUCHER
    }

    access(all) fun ErrorEncode(msg: String, err: ErrorCode): String {
        return "[IncLiquidStakingErrorMsg:".concat(msg).concat("]").concat(
               "[IncLiquidStakingErrorCode:").concat(err.rawValue.toString()).concat("]")
    }
}