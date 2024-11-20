/**

# Swap related interface definitions all-in-one

# Author: Increment Labs

*/
import FungibleToken from "../utility/FungibleToken.cdc"

access(all) contract interface SwapInterfaces {
    access(all) resource interface PairPublic {
        access(all) fun addLiquidity(tokenAVault: @{FungibleToken.Vault}, tokenBVault: @{FungibleToken.Vault}): @{FungibleToken.Vault}
        access(all) fun removeLiquidity(lpTokenVault: @{FungibleToken.Vault}) : @[{FungibleToken.Vault}]
        access(all) fun swap(vaultIn: @{FungibleToken.Vault}, exactAmountOut: UFix64?): @{FungibleToken.Vault}
        access(all) fun getAmountIn(amountOut: UFix64, tokenOutKey: String): UFix64
        access(all) fun getAmountOut(amountIn: UFix64, tokenInKey: String): UFix64
        access(all) fun getPrice0CumulativeLastScaled(): UInt256
        access(all) fun getPrice1CumulativeLastScaled(): UInt256
        access(all) fun getBlockTimestampLast(): UFix64
        access(all) fun getPairInfo(): [AnyStruct]
        access(all) fun getLpTokenVaultType(): Type
    }

    access(all) resource interface LpTokenCollectionPublic {
        access(all) fun deposit(pairAddr: Address, lpTokenVault: @{FungibleToken.Vault})
        access(all) fun getCollectionLength(): Int
        access(all) fun getLpTokenBalance(pairAddr: Address): UFix64
        access(all) fun getAllLPTokens(): [Address]
        access(all) fun getSlicedLPTokens(from: UInt64, to: UInt64): [Address]
    }
}