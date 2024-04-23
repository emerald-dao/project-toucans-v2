import FungibleToken from "../utility/FungibleToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"

transaction(recipient: Address, amount: UFix64) {
 
  let RecipientVault: &{FungibleToken.Receiver}
  let TokenVault: @FlowToken.Vault

  prepare(user: AuthAccount) {
    self.TokenVault <- user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    self.RecipientVault = getAccount(recipient).getCapability(/public/flowTokenReceiver).borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Recipient does not have vault set up.")
  }

  execute {
    self.RecipientVault.deposit(from: <- self.TokenVault)
  }
}