import FlowToken from "../utility/FlowToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

pub fun main(user: Address): UFix64 {
  let vault = getAccount(user).getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
  return vault?.balance ?? 0.0
}