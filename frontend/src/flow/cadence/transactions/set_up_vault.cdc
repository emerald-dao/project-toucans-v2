import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"
import Toucans from "../Toucans.cdc"

transaction() {
  prepare(user: auth(Storage, Capabilities) &Account) {
    if user.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = user.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      user.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    if user.storage.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) == nil {
      user.storage.save(<- ExampleToken.createEmptyVault(vaultType: Type<@ExampleToken.Vault>()), to: ExampleToken.VaultStoragePath)

      let publicCap = user.capabilities.storage.issue<&ExampleToken.Vault>(ExampleToken.VaultStoragePath)
      user.capabilities.publish(publicCap, at: ExampleToken.VaultPublicPath)

      let receiverCap = user.capabilities.storage.issue<&ExampleToken.Vault>(ExampleToken.VaultStoragePath)
      user.capabilities.publish(receiverCap, at: ExampleToken.ReceiverPublicPath)
    }
  }
}