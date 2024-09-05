import Toucans from "../Toucans.cdc"

transaction(
  projectId: String
) {

  prepare(signer: auth(Storage) &Account) {
    let toucansProjectCollection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.deleteProject(projectId: projectId)
  }

}