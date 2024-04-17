import "FungibleToken"
import "Toucans"

transaction(projectId: String, projectOwner: Address, amount: UFix64) {

  let Project: &Toucans.Project
  
  prepare(signer: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    self.Project.proposeMintToTreasury(amount: amount)
  }
}
 