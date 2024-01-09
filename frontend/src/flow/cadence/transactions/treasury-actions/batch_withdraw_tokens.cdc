import Toucans from "../../Toucans.cdc"
import ToucansTokens from "../../ToucansTokens.cdc"
import FungibleToken from "../../utility/FungibleToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `amount` `paymentTokenType` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(
  tokenSymbol: String, 
  amounts: {Address: UFix64}, 
  projectOwner: Address, 
  projectId: String
) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    var tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol)
    if tokenInfo == nil && tokenSymbol == self.Project.projectTokenInfo.symbol {
      tokenInfo = self.Project.projectTokenInfo
    }
    assert(tokenInfo != nil, message: "Didn't find token info.")

    let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>} = {}
    for wallet in amounts.keys {
      let cap = getAccount(wallet).getCapability<&{FungibleToken.Receiver}>(tokenInfo!.receiverPath)
      assert(cap.check(), message: "Invalid capability for ".concat(wallet.toString()).concat("!"))
      recipientVaults[wallet] = cap
    }

    self.Project.proposeBatchWithdraw(vaultType: tokenInfo!.tokenType, recipientVaults: recipientVaults, amounts: amounts)
  }
}