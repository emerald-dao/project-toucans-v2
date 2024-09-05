import "FungibleToken"
import "Toucans"
import "ExampleToken"

transaction(projectId: String, projectOwner: Address, amount: UFix64, recipient: Address) {

  let Project: &Toucans.Project
  let ProjectTokenReceiver: Capability<&{FungibleToken.Receiver}>

  prepare(owner: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.ProjectTokenReceiver = getAccount(recipient).capabilities.get<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
          ?? panic("The person you are attempting to mint to does not have a vault set up.")
  }

  execute {
    self.Project.proposeMint(recipientVault: self.ProjectTokenReceiver, amount: amount)
  }
}
 