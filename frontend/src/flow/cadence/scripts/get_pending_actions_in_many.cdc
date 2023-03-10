import Toucans from "../Toucans.cdc"

pub fun main(user: Address, projectOwners: [Address], projectIds: [String]): {String: Project} {
  pre {
    projectOwners.length == projectIds.length: "Must input same number of inputs."
  }
  let answer: {String: Project} = {}
  var i = 0
  while i < projectOwners.length {
    let projectId = projectIds[i]
    let projectCollection = getAccount(projectOwners[i]).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")
    let manager = projectCollection.borrowProjectPublic(projectId: projectId)!.borrowManagerPublic()
    let actions: [Action] = []
    for actionId in manager.getIDs() {
      let action = manager.borrowAction(actionUUID: actionId)
      let actionDetails = action.getAction()
      actions.append(Action(actionId, actionDetails.intent, actionDetails.title, action.getVotes()))
    }
    
    answer[projectId] = Project(manager.getSigners().contains(user), actions, manager.threshold)
  }

  return answer
}

pub struct Project {
  pub let isSigner: Bool
  pub let actions: [Action]
  pub let threshold: UInt64

  init(_ i: Bool, _ a: [Action], _ t: UInt64) {
    self.isSigner = i
    self.actions = a
    self.threshold = t
  }
}

pub struct Action {
  pub let id: UInt64
  pub let intent: String
  pub let title: String
  pub let votes: {Address: Bool}

  init(_ id: UInt64, _ i: String, _ t: String, _ s: {Address: Bool}) {
    self.id = id
    self.intent = i
    self.title = t
    self.votes = s
  }
}