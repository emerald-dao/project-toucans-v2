import "FlowToken"
import "FungibleToken"

access(all) fun main(user: Address): UFix64 {
  let vault = getAccount(user).capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
  return vault?.balance ?? 0.0
}