import FlowToken from "../utility/FlowToken.cdc"
import stFlowToken from "../utility/stFlowToken.cdc"
import SwapFactory from "../utility/SwapFactory.cdc"
import SwapInterfaces from "../utility/SwapInterfaces.cdc"
import SwapConfig from "../utility/SwapConfig.cdc"

// stable pair is generally better so we use 
// that for now. but if we want to compare between
// v1 and stable, then uncomment the code below
pub fun main(amountIn: UFix64, tokenInKey: String): UFix64 {
    // let pairv1Address: Address = 0x396c0cda3302d8c5
    // let pairv1PublicRef = getAccount(pairv1Address)
    //     .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
    //     .borrow()
    //     ?? panic("cannot borrow reference to PairPublic resource")

    // let pairv1Info = pairv1PublicRef.getPairInfo()

    let pairStableAddress: Address = 0xc353b9d685ec427d
    let pairStablePublicRef = getAccount(pairStableAddress)
        .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
        .borrow()
        ?? panic("cannot borrow reference to PairPublic resource")

    let amountOut = pairStablePublicRef.getAmountOut(amountIn: amountIn, tokenInKey: tokenInKey)

    // if pairv1Info[5] as! UFix64 > pairStableInfo[5] as! UFix64 {
    //     return pairv1Info
    // } else {
    //     return pairStableInfo
    // }

    return amountOut
}