import FungibleToken from "../utility/FungibleToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"

transaction(recipient: Address, amount: UFix64) {
 
  let RecipientVault: &{FungibleToken.Receiver}
  let TokenVault: @FlowToken.Vault

  prepare(user: auth(Storage, Capabilities) &Account) {
    self.TokenVault <- user.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    self.RecipientVault = getAccount(recipient).capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                                ?? panic("Recipient does not have vault set up.")
  }

  execute {
    self.RecipientVault.deposit(from: <- self.TokenVault)
  }
}