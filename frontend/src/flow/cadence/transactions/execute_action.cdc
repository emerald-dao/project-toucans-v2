import Toucans from "../Toucans.cdc"

transaction(projectOwner: Address, projectId: UInt64, actionUUID: UInt64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
  }
  execute {
    self.Project.executeAction(actionUUID: actionUUID)
  }
}