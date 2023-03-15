import Toucans from "../Toucans.cdc"
import ToucansMultiSign from "../ToucansMultiSign.cdc"
import ToucansTreasuryActions from "../ToucansTreasuryActions.cdc"

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
      let actionDetails: {ToucansMultiSign.Action} = action.getAction()
      let optionalData: {String: AnyStruct} = {}
      if actionDetails.getType() == Type<ToucansTreasuryActions.AddOneSigner>() {
        let castedAction = actionDetails as! ToucansTreasuryActions.AddOneSigner
        optionalData["newSigner"] = castedAction.signer
        optionalData["pendingSignature"] = action.getVotes().length == Int(manager.threshold)
      }
      actions.append(Action(actionId, actionDetails.intent, actionDetails.title, action.getVotes(), optionalData))
    }
    
    answer[projectId] = Project(manager.getSigners().contains(user), actions, manager.threshold)
    i = i + 1
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
  pub let optionalData: {String: AnyStruct}

  init(_ id: UInt64, _ i: String, _ t: String, _ s: {Address: Bool}, _ o: {String: AnyStruct}) {
    self.id = id
    self.intent = i
    self.title = t
    self.votes = s
    self.optionalData = o
  }
}
