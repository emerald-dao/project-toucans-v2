import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  actionUUID: UInt64,
  vote: Bool
) {

  let Collection: &Toucans.Collection
  
  prepare(signer: AuthAccount) {
    if signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      signer.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }
    
    self.Collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
              ?? panic("Signer does not have Toucans collection does not exist.")
  }
  execute {
    self.Collection.voteOnProjectAction(projectOwner: projectOwner, projectId: projectId, actionUUID: actionUUID, vote: vote)
  }
}