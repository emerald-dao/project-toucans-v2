import ToucansTreasuryActions from "../../ToucansTreasuryActions.cdc"
import Toucans from "../../Toucans.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Add `newSigners` to the treasury

transaction(projectOwner: Address, projectId: String, newSigners: [Address], newThreshold: UInt64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
  }

  execute {
    let managerPublic = self.Project.borrowManagerPublic()
    let existingSigners = managerPublic.getSigners()
    let existingThreshold = managerPublic.threshold
    // Propose the new action
    for newSigner in newSigners {
        if !existingSigners.contains(newSigner) {
          let addSignerAction = ToucansTreasuryActions.AddOneSigner(_signer: newSigner)
          self.Project.proposeAction(action: addSignerAction)
        }
    }

    for oldSigner in existingSigners {
      if !newSigners.contains(oldSigner) {
        let removeSignerAction = ToucansTreasuryActions.RemoveOneSigner(_signer: oldSigner)
        self.Project.proposeAction(action: removeSignerAction)
      }
    }

    if newThreshold != existingThreshold {
      let updateThresholdAction = ToucansTreasuryActions.UpdateTreasuryThreshold(_threshold: newThreshold)
      self.Project.proposeAction(action: updateThresholdAction)
    }
  }
}