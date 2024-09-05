import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

access(all) fun main(projectOwner: Address, projectId: String, actionId: UInt64): Result? {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  let manager = info.borrowManagerPublic()
  let action = manager.borrowAction(actionUUID: actionId)
  if let actionWithdrawDetails = action.action as? ToucansActions.BatchWithdrawToken {
    return Result(actionWithdrawDetails.amounts, actionWithdrawDetails.tokenSymbol)
  } else if let actionMintDetails = action.action as? ToucansActions.BatchMintTokens {
    return Result(actionMintDetails.amounts, actionMintDetails.tokenSymbol)
  }

  return nil
}

access(all) struct Result {
  access(all) let amounts: {Address: UFix64}
  access(all) let currency: String
  
  init(_ a: {Address: UFix64}, _ c: String) {
    self.amounts = a
    self.currency = c
  }
}