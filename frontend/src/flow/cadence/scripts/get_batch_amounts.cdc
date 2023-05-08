import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

pub fun main(projectOwner: Address, projectId: String, actionId: UInt64): Result? {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
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

pub struct Result {
  pub let amounts: {Address: UFix64}
  pub let currency: String
  
  init(_ a: {Address: UFix64}, _ c: String) {
    self.amounts = a
    self.currency = c
  }
}