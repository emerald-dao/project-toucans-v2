import Toucans from "../Toucans.cdc"

access(all) fun main(projectOwner: Address, projectId: String): [Action] {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
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

access(all) struct Action {
  access(all) let id: UInt64
  access(all) let intent: String
  access(all) let title: String
  access(all) let votes: {Address: Bool}
  access(all) let signers: [Address]
  access(all) let threshold: UInt64

  init(_ id: UInt64, _ i: String, _ t: String, _ s: {Address: Bool}, _ si: [Address], _ th: UInt64) {
    self.id = id
    self.intent = i
    self.title = t
    self.votes = s
    self.signers = si
    self.threshold = th
  }
}