import ToucansUtils from "../ToucansUtils.cdc"

access(all) fun main(amountIn: UFix64, tokenInKey: String): UFix64 {
    return ToucansUtils.getEstimatedOut(amountIn: amountIn, tokenInKey: tokenInKey)
}