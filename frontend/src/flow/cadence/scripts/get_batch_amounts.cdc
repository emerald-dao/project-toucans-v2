import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

pub fun main(projectOwner: Address, projectId: String, actionId: UInt64): {Address: UFix64} {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  let manager = info.borrowManagerPublic()
  let action = manager.borrowAction(actionUUID: actionId)
  if let actionWithdrawDetails = action.action as? ToucansActions.BatchWithdrawToken {
    return actionWithdrawDetails.amounts
  } else if let actionMintDetails = action.action as? ToucansActions.BatchMintTokens {
    return actionMintDetails.amounts
  }

  return {}
}