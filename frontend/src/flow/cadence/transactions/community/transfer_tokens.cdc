import FungibleToken from 0xee82856bf20e2aa6
import bummm from 0xf8d6e0586b0a20c7

transaction(amount: UFix64, recipient: Address) {

  let Vault: &bummm.Vault
  let RecipientVault: &bummm.Vault{FungibleToken.Receiver}

  prepare(user: AuthAccount) {
    self.Vault = user.borrow<&bummm.Vault>(from: bummm.VaultStoragePath)
              ?? panic("User does not have a Vault set up.")
    self.RecipientVault = getAccount(user.address).getCapability(bummm.ReceiverPublicPath)
              .borrow<&bummm.Vault{FungibleToken.Receiver}>()
              ?? panic("Recipient does not have a Vault set up.")     
  }

  execute {
    self.Vault.transfer(amount: amount, recipient: self.RecipientVault)
  }

}