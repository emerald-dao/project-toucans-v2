import "Toucans"

transaction(projectId: String) {

  let Project: auth(Toucans.Owner) &Toucans.Project

  prepare(signer: auth(Storage) &Account) {
    let projectCollection = signer.storage.borrow<auth(Toucans.Owner) &Toucans.Collection>(from: Toucans.CollectionStoragePath) ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    self.Project.togglePurchasing()
  }
}
