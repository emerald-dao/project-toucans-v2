import ToucansUtils from "../ToucansUtils.cdc"

pub fun main(amountIn: UFix64, tokenInKey: String): UFix64 {
    return ToucansUtils.getEstimatedOut(amountIn: amountIn, tokenInKey: tokenInKey)
}