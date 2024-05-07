import ExampleToken from "../ExampleToken.cdc"

pub fun main(user: Address): UFix64 {
  let vault = getAuthAccount(user).borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)
  return vault?.balance ?? 0.0
}