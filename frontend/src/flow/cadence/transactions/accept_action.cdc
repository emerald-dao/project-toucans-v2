import Toucans from "../Toucans.cdc"
import ToucansMultiSign from "../ToucansMultiSign.cdc"
import ToucansTreasuryActions from "../ToucansTreasuryActions.cdc"

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
    action.accept(acctAddress: self.SignerAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)

    if manager.getActionState(actionUUID: actionUUID) == ToucansMultiSign.ActionState.DECLINED || 
       (manager.getActionState(actionUUID: actionUUID) == ToucansMultiSign.ActionState.ACCEPTED && !ToucansTreasuryActions.cantExecuteAutomatically().contains(action.getAction().getType())) {
        self.Project.finalizeAction(actionUUID: actionUUID, {})
    }
  }
}