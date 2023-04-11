import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

transaction(projectOwner: Address, projectId: String, actionUUID: UInt64, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let SignerAddress: Address
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
    self.SignerAddress = signer.address
  }
  execute {
    let manager = self.Project.borrowManagerPublic()
    let action = manager.borrowAction(actionUUID: actionUUID)
    action.decline(acctAddress: self.SignerAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)

    if manager.readyToFinalize(actionUUID: actionUUID) {
      self.Project.finalizeAction(actionUUID: actionUUID)
    }
  }
}