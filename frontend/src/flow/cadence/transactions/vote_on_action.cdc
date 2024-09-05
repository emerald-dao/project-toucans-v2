import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  actionUUID: UInt64,
  vote: Bool
) {

  let Collection: auth(Toucans.CollectionOwner) &Toucans.Collection
  
  prepare(signer: auth(Storage, Capabilities) &Account) {
    if signer.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = signer.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      signer.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }
    
    self.Collection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)
              ?? panic("Signer does not have Toucans collection does not exist.")
  }
  execute {
    self.Collection.voteOnProjectAction(projectOwner: projectOwner, projectId: projectId, actionUUID: actionUUID, vote: vote)
  }
}