import ToucansActions from "../../ToucansActions.cdc"
import Toucans from "../../Toucans.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"
import FlowToken from "../../utility/FlowToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `Flow Token` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(projectOwner: Address, projectId: String, recipientAddr: Address, amount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let RecipientVault: Capability<&{FungibleToken.Receiver}>
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
    self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
  }

  execute {
    // Propose the new action
    let action = ToucansActions.WithdrawToken(_recipientVault: self.RecipientVault, _amount: amount)
    self.Project.proposeAction(action: action)
  }
}