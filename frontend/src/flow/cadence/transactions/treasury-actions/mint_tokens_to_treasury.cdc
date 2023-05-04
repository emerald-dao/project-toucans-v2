import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"

transaction(projectId: String, amount: UFix64) {

  let Project: &Toucans.Project

  prepare(owner: AuthAccount) {
    let projectCollection = owner.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    self.Project.proposeMintToTreasury(amount: amount)
  }
}
 