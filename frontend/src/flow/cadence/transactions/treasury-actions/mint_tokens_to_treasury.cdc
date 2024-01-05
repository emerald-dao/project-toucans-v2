import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"

transaction(projectId: String, projectOwner: Address, amount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    self.Project.proposeMintToTreasury(amount: amount)
  }
}
 