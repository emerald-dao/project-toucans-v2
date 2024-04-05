import Toucans from "../../Toucans.cdc"
import ToucansTokens from "../../ToucansTokens.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `tokenSymbol` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(tokenSymbol: String, recipientAddr: Address, amount: UFix64, projectOwner: Address, projectId: String) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
  }

  execute {
    var tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol)
    if tokenInfo == nil && tokenSymbol == self.Project.projectTokenInfo.symbol {
      tokenInfo = self.Project.projectTokenInfo
    }
    assert(tokenInfo != nil, message: "Didn't find token info.")
    let recipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(tokenInfo!.receiverPath)
    self.Project.proposeWithdraw(vaultType: tokenInfo!.vaultType, recipientVault: recipientVault!, amount: amount)
  }
}