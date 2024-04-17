import "Toucans"

transaction(
  projectOwner: Address, 
  projectId: String, 
  amount: UFix64 // the amount of overflow to transfer
) {

  let Project: auth(Toucans.Owner) &Toucans.Project
  
  prepare(signer: auth(Storage) &Account) {
    let collection = signer.storage.borrow<auth(Toucans.Owner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
   
  }
  execute {
    self.Project.transferOverflowToCurrentRound(amount: amount)
  }
}