import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

pub fun main(user: Address): Bool {
  return getAuthAccount(user).borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) != nil
}