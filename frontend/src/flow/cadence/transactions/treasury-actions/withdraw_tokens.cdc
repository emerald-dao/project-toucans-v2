import Toucans from "../../Toucans.cdc"
import ToucansTokens from "../../ToucansTokens.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `paymentTokenType` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(tokenSymbol: String, recipientAddr: Address, amount: UFix64, projectOwner: Address, projectId: String) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let RecipientVault: Capability<&{FungibleToken.Receiver}>?
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
      self.RecipientVault  = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(tokenInfo.receiverPath)
    } else if tokenSymbol == self.Project.projectTokenInfo.symbol {
      self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(self.Project.projectTokenInfo.receiverPath)
    } else {
      self.RecipientVault = nil
    }
  }

  pre {
    self.RecipientVault != nil: "Didn't find token info."
  }

  execute {
    self.Project.proposeWithdraw(recipientVault: self.RecipientVault!, amount: amount)
  }
}