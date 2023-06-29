import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"
import FlowToken from "../utility/FlowToken.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String) {
 
  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Payment: @FlowToken.Vault
  let Payer: Address

  prepare(user: AuthAccount) {
    if user.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      user.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
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