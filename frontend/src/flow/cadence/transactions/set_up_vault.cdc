import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"
import Toucans from "../Toucans.cdc"

transaction() {
  prepare(user: AuthAccount) {
    if user.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      user.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }

    if user.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) == nil {
      user.save(<- ExampleToken.createEmptyVault(), to: ExampleToken.VaultStoragePath)
    }

    if user.getCapability(ExampleToken.ReceiverPublicPath).borrow<&ExampleToken.Vault{FungibleToken.Receiver}>() == nil {
      user.unlink(ExampleToken.ReceiverPublicPath)
      user.link<&ExampleToken.Vault{FungibleToken.Receiver}>(
          ExampleToken.ReceiverPublicPath,
          target: ExampleToken.VaultStoragePath
      )
    }

    if user.getCapability(ExampleToken.VaultPublicPath).borrow<&ExampleToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>() == nil {
      user.unlink(ExampleToken.VaultPublicPath)
      user.link<&ExampleToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
          ExampleToken.VaultPublicPath,
          target: ExampleToken.VaultStoragePath
      )
    }
  }
}