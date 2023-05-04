import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleToken from "../../ExampleToken.cdc"

transaction(projectId: String, amount: UFix64, recipient: Address) {

  let Project: &Toucans.Project
  let ProjectTokenReceiver: Capability<&ExampleToken.Vault{FungibleToken.Receiver}>

  prepare(owner: AuthAccount) {
    let projectCollection = owner.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.ProjectTokenReceiver = getAccount(recipient).getCapability<&ExampleToken.Vault{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
  }

  execute {
    self.Project.proposeMint(recipientVault: self.ProjectTokenReceiver, amount: amount)
  }
}
 