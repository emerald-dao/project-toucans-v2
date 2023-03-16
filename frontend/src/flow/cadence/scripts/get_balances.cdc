import FUSD from "../utility/FUSD.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

pub fun main(user: Address): {String: UFix64} {
  let fusdVault = getAccount(user).getCapability(/public/fusdBalance)
                .borrow<&FUSD.Vault{FungibleToken.Balance}>()
  let flowVault = getAccount(user).getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault{FungibleToken.Balance}>()

  return {
    "FUSD": fusdVault?.balance ?? 0.0,
    "FLOW": flowVault?.balance ?? 0.0
  }
}
 