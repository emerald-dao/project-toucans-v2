import FungibleToken from "../utility/FungibleToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"
import ExampleToken from "../ExampleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String, expectedAmount: UFix64) {

  let Project: &Toucans.Project
  let Payment: @FlowToken.Vault
  let ProjectTokenReceiver: &{FungibleToken.Receiver, FungibleToken.Balance}

  prepare(user: auth(Storage, Capabilities) &Account) {
    if user.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = user.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      user.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    // Setup User Account
    if user.storage.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) == nil {
      user.storage.save(<- ExampleToken.createEmptyVault(vaultType: Type<@ExampleToken.Vault>()), to: ExampleToken.VaultStoragePath)

      let publicCap = user.capabilities.storage.issue<&ExampleToken.Vault>(ExampleToken.VaultStoragePath)
      user.capabilities.publish(publicCap, at: ExampleToken.VaultPublicPath)

      let receiverCap = user.capabilities.storage.issue<&ExampleToken.Vault>(ExampleToken.VaultStoragePath)
      user.capabilities.publish(receiverCap, at: ExampleToken.ReceiverPublicPath)
    }

    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.Payment <- user.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    
    self.ProjectTokenReceiver = user.storage.borrow<&{FungibleToken.Receiver, FungibleToken.Balance}>(from: ExampleToken.VaultStoragePath)!
  }

  execute {
    let currentBalance: UFix64 = self.ProjectTokenReceiver.balance
    self.Project.purchase(paymentTokens: <- self.Payment, projectTokenReceiver: self.ProjectTokenReceiver, message: message)
    if self.ProjectTokenReceiver.balance >= 1.0 {
      assert(
        (currentBalance + expectedAmount >= self.ProjectTokenReceiver.balance - 1.0 && currentBalance + expectedAmount <= self.ProjectTokenReceiver.balance + 1.0),
        message: "The expected amount of tokens was not minted."
      )
    }
  }
}
 