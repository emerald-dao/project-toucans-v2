import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

pub fun main(user: Address): UFix64 {
  let projectTokenVault = getAccount(user).getCapability(ExampleToken.VaultPublicPath)
                .borrow<&ExampleToken.Vault{FungibleToken.Balance}>()

  return projectTokenVault?.balance ?? 0.0
}