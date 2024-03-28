import "Toucans"

transaction(
  projectId: String
) {

  prepare(signer: auth(Storage) &Account) {
    let toucansProjectCollection = signer.storage.borrow<auth(Toucans.Owner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.deleteProject(projectId: projectId)
  }

}