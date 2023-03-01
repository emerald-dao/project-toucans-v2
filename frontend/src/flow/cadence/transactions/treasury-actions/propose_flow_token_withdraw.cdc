import ToucansTreasuryActions from "../../ToucansTreasuryActions.cdc"
import Toucans from "../../Toucans.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"
import FlowToken from "../../utility/FlowToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `Flow Token` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(projectOwner: Address, projectId: UInt64, recipientAddr: Address, amount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let RecipientVault: Capability<&{FungibleToken.Receiver}>
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
    self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    assert(self.RecipientVault.getType() == Type<&FlowToken.Vault>(), message: "This is not an FlowToken Vault.")
  }

  execute {
    // Propose the new action
    let action = ToucansTreasuryActions.WithdrawToken(_recipientVault: self.RecipientVault, _amount: amount)
    let newActionId = self.Project.proposeAction(action: action)

    // Execute if we can (threshold is 0)
    let manager = self.Project.borrowManagerPublic()
    if manager.readyToExecute(actionUUID: newActionId) {
      self.Project.executeAction(actionUUID: newActionId)
    }
  }
}