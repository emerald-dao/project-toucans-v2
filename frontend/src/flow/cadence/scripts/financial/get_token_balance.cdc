import ExampleFinancial from "../../ExampleFinancial.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"

pub fun main(user: Address): UFix64 {
  let projectTokenVault = getAccount(user).getCapability(ExampleFinancial.VaultPublicPath)
                .borrow<&ExampleFinancial.Vault{FungibleToken.Balance}>()

  return projectTokenVault?.balance ?? 0.0
}