import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

transaction(recipient: Address, amount: UFix64) {
 
  let RecipientVault: &{FungibleToken.Receiver}
  let TokenVault: @ExampleToken.Vault

  prepare(user: AuthAccount) {
    self.TokenVault <- user.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)!.withdraw(amount: amount) as! @ExampleToken.Vault
    self.RecipientVault = getAccount(recipient).getCapability(ExampleToken.ReceiverPublicPath).borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Recipient does not have vault set up.")
  }

  execute {
    self.RecipientVault.deposit(from: <- self.TokenVault)
  }
}