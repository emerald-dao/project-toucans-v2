import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

transaction(recipient: Address, amount: UFix64) {
 
  let RecipientVault: &{FungibleToken.Receiver}
  let TokenVault: @ExampleToken.Vault

  prepare(user: auth(Storage, Capabilities) &Account) {
    self.TokenVault <- user.storage.borrow<auth(FungibleToken.Withdraw) &ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)!.withdraw(amount: amount) as! @ExampleToken.Vault
    self.RecipientVault = getAccount(recipient).capabilities.borrow<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
                                ?? panic("Recipient does not have vault set up.")
  }

  execute {
    self.RecipientVault.deposit(from: <- self.TokenVault)
  }
}