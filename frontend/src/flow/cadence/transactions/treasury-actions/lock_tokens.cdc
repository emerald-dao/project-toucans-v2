import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ToucansTokens from "../../ToucansTokens.cdc"

transaction(tokenSymbol: String, projectId: String, projectOwner: Address, amount: UFix64, recipient: Address, unlockTime: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  
  prepare(signer: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
      self.Project.proposeLockTokens(recipient: recipient, tokenType: tokenInfo.tokenType, amount: amount, unlockTime: unlockTime)
    } else if tokenSymbol == self.Project.projectTokenInfo.symbol {
      self.Project.proposeLockTokens(recipient: recipient, tokenType: self.Project.projectTokenInfo.tokenType, amount: amount, unlockTime: unlockTime)
    } else {
      panic("Not a correct token type for locking tokens.")
    }
  }
}
 