import ToucansActions from "../../ToucansActions.cdc"
import Toucans from "../../Toucans.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Add `newSigners` to the treasury

transaction(projectOwner: Address, projectId: String, newSigners: [Address], newThreshold: UInt64) {

  let Project: &Toucans.Project
  
  prepare(signer: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    let managerPublic = self.Project.borrowManagerPublic()
    let existingSigners = managerPublic.getSigners()
    let existingThreshold = managerPublic.threshold
    // Propose the new action
    for newSigner in newSigners {
        if !existingSigners.contains(newSigner) {
          let addSignerAction = ToucansActions.AddOneSigner(newSigner)
          self.Project.proposeAddSigner(signer: newSigner)
        }
    }

    for oldSigner in existingSigners {
      if !newSigners.contains(oldSigner) {
        let removeSignerAction = ToucansActions.RemoveOneSigner(oldSigner)
        self.Project.proposeRemoveSigner(signer: oldSigner)
      }
    }

    if newThreshold != existingThreshold {
      let updateThresholdAction = ToucansActions.UpdateTreasuryThreshold(newThreshold)
      self.Project.proposeUpdateThreshold(threshold: newThreshold)
    }
  }
}