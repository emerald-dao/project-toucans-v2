import Toucans from "../Toucans.cdc"

transaction(
  projectId: String
) {

  prepare(signer: AuthAccount) {
    let toucansProjectCollection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.deleteProject(projectId: projectId)
  }

}