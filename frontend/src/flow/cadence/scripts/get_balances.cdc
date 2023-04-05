import FiatToken from "../utility/FiatToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

pub fun main(user: Address): {String: UFix64} {
  let usdcVault = getAccount(user).getCapability(/public/USDCVaultBalance)
                .borrow<&FiatToken.Vault{FungibleToken.Balance}>()
  let flowVault = getAccount(user).getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault{FungibleToken.Balance}>()

  return {
    "USDC": usdcVault?.balance ?? 0.0,
    "FLOW": flowVault?.balance ?? 0.0
  }
}
 