import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import ExampleToken from "../ExampleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String) {
 
  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Payment: @FlowToken.Vault
  let Payer: Address

  prepare(user: AuthAccount) {
    if user.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      user.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }
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
    self.Payer = user.address          
  }

  execute {
    self.Project.donateToTreasury(vault: <- self.Payment, payer: self.Payer, message: message)
  }
}