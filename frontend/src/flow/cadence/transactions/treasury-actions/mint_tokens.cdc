import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleToken from "../../ExampleToken.cdc"

transaction(projectId: String, projectOwner: Address, amount: UFix64, recipient: Address) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let ProjectTokenReceiver: Capability<&{FungibleToken.Receiver}>

  prepare(owner: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.ProjectTokenReceiver = getAccount(recipient).getCapability<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
  }

  execute {
    self.Project.proposeMint(recipientVault: self.ProjectTokenReceiver, amount: amount)
  }
}
 