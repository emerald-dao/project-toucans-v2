import "FiatToken"
import "FlowToken"
import "FungibleToken"

access(all) fun main(user: Address): {String: UFix64} {
  let usdcVault = getAccount(user).capabilities.borrow<&FiatToken.Vault>(/public/USDCVaultBalance)
  let flowVault = getAccount(user).capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)

  return {
    "USDC": usdcVault?.balance ?? 0.0,
    "FLOW": flowVault?.balance ?? 0.0
  }
}
 