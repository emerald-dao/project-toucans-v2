import Toucans from "../Toucans.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  amount: UFix64 // the amount of overflow to transfer
) {

  let Project: &Toucans.Project
  
  prepare(signer: AuthAccount) {
    let collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
   
  }
  execute {
    self.Project.transferOverflowToCurrentRound(amount: amount)
  }
}