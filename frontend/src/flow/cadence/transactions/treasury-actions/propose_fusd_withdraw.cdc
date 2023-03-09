import ToucansTreasuryActions from "../../ToucansTreasuryActions.cdc"
import Toucans from "../../Toucans.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"
import FUSD from "../../utility/FUSD.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `FUSD` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(projectOwner: Address, projectId: String, recipientAddr: Address, amount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let RecipientVault: Capability<&{FungibleToken.Receiver}>
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
    assert(self.RecipientVault.getType() == Type<&FUSD.Vault>(), message: "This is not an FUSD Vault.")
  }

  execute {
    // Propose the new action
    let action = ToucansTreasuryActions.WithdrawToken(_recipientVault: self.RecipientVault, _amount: amount)
    self.Project.proposeAction(action: action)
  }
}