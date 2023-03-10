import Toucans from "../Toucans.cdc"

// This is for finalizing the `AddSigner` transaction once its ready to finalize
// The signer who is being added must have signed the action to complete it, that's 
// what this is for.

transaction(
    projectOwner: Address, 
    projectId: String, 
    actionUUID: UInt64,
    message: String, 
    keyIds: [Int], 
    signatures: [String], 
    signatureBlock: UInt64
) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
  }
  execute {
    self.Project.finalizeAction(actionUUID: actionUUID, {"message": message, "keyIds": keyIds, "signatures": signatures, "signatureBlock": signatureBlock})
  }
}