import Toucans from "../Toucans.cdc"

pub fun main(projectOwner: Address, projectId: String): [Action] {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  let actions: [Action] = []
  let manager = info.borrowManagerPublic()
  for actionId in manager.getIDs() {
    let action = manager.borrowAction(actionUUID: actionId)
    let actionDetails = action.action
    actions.append(Action(actionId, actionDetails.getIntent(), actionDetails.getTitle(), action.getVotes(), action.getSigners(), action.threshold))
  }

  return actions
}

pub struct Action {
  pub let id: UInt64
  pub let intent: String
  pub let title: String
  pub let votes: {Address: Bool}
  pub let signers: [Address]
  pub let threshold: UInt64

  init(_ id: UInt64, _ i: String, _ t: String, _ s: {Address: Bool}, _ si: [Address], _ th: UInt64) {
    self.id = id
    self.intent = i
    self.title = t
    self.votes = s
    self.signers = si
    self.threshold = th
  }
}