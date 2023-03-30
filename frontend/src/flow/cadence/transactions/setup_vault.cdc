import emeralddao from 0xf8d6e0586b0a20c7
import FungibleToken from "../utility/FungibleToken.cdc"
import MetadataViews from 0xf8d6e0586b0a20c7

transaction() {
  prepare(user: AuthAccount) {
    if user.borrow<&emeralddao.Vault>(from: emeralddao.VaultStoragePath) == nil {
      user.save(<- emeralddao.createEmptyVault(), to: emeralddao.VaultStoragePath)
      user.link<&emeralddao.Vault{FungibleToken.Receiver}>(
          emeralddao.ReceiverPublicPath,
          target: emeralddao.VaultStoragePath
      )

      user.link<&emeralddao.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
          emeralddao.VaultPublicPath,
          target: emeralddao.VaultStoragePath
      )
    }
  }
}