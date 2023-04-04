import ToucansActions from "../../ToucansActions.cdc"
import Toucans from "../../Toucans.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Add `newSigners` to the treasury

transaction(projectOwner: Address, projectId: String, newSigners: [Address], newThreshold: UInt64) {

  let Project: &Toucans.Project
  
  prepare(owner: AuthAccount) {
    let collection = owner.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
  }

  execute {
    let managerPublic = self.Project.borrowManagerPublic()
    let existingSigners = managerPublic.getSigners()
    let existingThreshold = managerPublic.threshold
    // Propose the new action
    for newSigner in newSigners {
        if !existingSigners.contains(newSigner) {
          let addSignerAction = ToucansActions.AddOneSigner(_signer: newSigner)
          self.Project.proposeAddSigner(signer: newSigner)
        }
    }

    for oldSigner in existingSigners {
      if !newSigners.contains(oldSigner) {
        let removeSignerAction = ToucansActions.RemoveOneSigner(_signer: oldSigner)
        self.Project.proposeRemoveSigner(signer: oldSigner)
      }
    }

    if newThreshold != existingThreshold {
      let updateThresholdAction = ToucansActions.UpdateTreasuryThreshold(_threshold: newThreshold)
      self.Project.proposeUpdateThreshold(threshold: newThreshold)
    }
  }
}