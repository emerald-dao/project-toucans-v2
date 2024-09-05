import Toucans from "../Toucans.cdc"

transaction(projectId: String) {

  let Project: auth(Toucans.ProjectOwner) &Toucans.Project

  prepare(signer: auth(Storage) &Account) {
    let projectCollection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath) ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    self.Project.togglePurchasing()
  }
}
