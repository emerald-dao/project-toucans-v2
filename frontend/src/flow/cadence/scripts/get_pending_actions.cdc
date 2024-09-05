import Toucans from "../Toucans.cdc"
import ToucansActions from "../ToucansActions.cdc"

access(all) fun main(user: Address, projectOwners: [Address], projectIds: [String]): {String: [Action]} {
  pre {
    projectOwners.length == projectIds.length: "Must input same number of inputs."
  }
  let answer: {String: [Action]} = {}
  var i = 0
  while i < projectOwners.length {
    let projectId = projectIds[i]
    let projectCollection = getAccount(projectOwners[i]).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
    let manager = projectCollection.borrowProjectPublic(projectId: projectId)!.borrowManagerPublic()
    let actions: [Action] = []
    for actionId in manager.getIDs() {
      let action = manager.borrowAction(actionUUID: actionId)
      let actionDetails = action.action
      actions.append(Action(actionId, actionDetails.getIntent(), actionDetails.getTitle(), action.threshold, action.getVotes(), action.getSigners()))
    }
    
    answer[projectId] = actions
    i = i + 1
  }

  return answer
}

access(all) struct Action {
  access(all) let id: UInt64
  access(all) let intent: String
  access(all) let title: String
  access(all) let threshold: UInt64
  access(all) let votes: {Address: Bool}
  access(all) let signers: [Address]

  init(_ id: UInt64, _ i: String, _ t: String, _ th: UInt64, _ s: {Address: Bool}, _ si: [Address]) {
    self.id = id
    self.intent = i
    self.title = t
    self.threshold = th
    self.votes = s
    self.signers = si
  }
}
