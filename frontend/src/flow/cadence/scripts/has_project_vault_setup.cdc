import ExampleToken from "../ExampleToken.cdc"

access(all) fun main(user: Address): Bool {
  let authAccount = getAuthAccount<auth(Storage, Capabilities) &Account>(user)
  return authAccount.storage.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) != nil
}