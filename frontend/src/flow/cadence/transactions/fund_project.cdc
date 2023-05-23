import FungibleToken from "../utility/FungibleToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"
import ExampleToken from "../ExampleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String, expectedAmount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Payment: @FlowToken.Vault
  let ProjectTokenReceiver: &{FungibleToken.Receiver, FungibleToken.Balance}

  prepare(user: AuthAccount) {
    // Setup User Account
    if user.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath) == nil {
      user.save(<- ExampleToken.createEmptyVault(), to: ExampleToken.VaultStoragePath)
      user.link<&ExampleToken.Vault{FungibleToken.Receiver}>(
          ExampleToken.ReceiverPublicPath,
          target: ExampleToken.VaultStoragePath
      )

      user.link<&ExampleToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
          ExampleToken.VaultPublicPath,
          target: ExampleToken.VaultStoragePath
      )
    }

    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.Payment <- user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    
    self.ProjectTokenReceiver = user.borrow<&{FungibleToken.Receiver, FungibleToken.Balance}>(from: ExampleToken.VaultStoragePath)!
  }

  execute {
    let currentBalance: UFix64 = self.ProjectTokenReceiver.balance
    self.Project.purchase(paymentTokens: <- self.Payment, projectTokenReceiver: self.ProjectTokenReceiver, message: message)
    assert(
      (currentBalance + expectedAmount >= self.ProjectTokenReceiver.balance - 1.0 && currentBalance + expectedAmount <= self.ProjectTokenReceiver.balance + 1.0),
      message: "The expected amount of tokens was not minted."
    )
  }
}
 