import "Toucans"
import "ToucansTokens"
import "FungibleToken"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `paymentTokenType` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(tokenSymbol: String, recipientAddr: Address, amount: UFix64, projectOwner: Address, projectId: String) {

  let Project: &Toucans.Project
  let RecipientVault: Capability<&{FungibleToken.Receiver}>?
  
  prepare(signer: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
      self.RecipientVault  = getAccount(recipientAddr).capabilities.get<&{FungibleToken.Receiver}>(tokenInfo.receiverPath)
    } else if tokenSymbol == self.Project.projectTokenInfo.symbol {
      self.RecipientVault = getAccount(recipientAddr).capabilities.get<&{FungibleToken.Receiver}>(self.Project.projectTokenInfo.receiverPath)
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