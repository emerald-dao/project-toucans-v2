import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ToucansTokens from "../../ToucansTokens.cdc"

transaction(tokenSymbol: String, projectId: String, amount: UFix64) {

  let Project: &Toucans.Project

  prepare(owner: AuthAccount) {
    let projectCollection = owner.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
      self.Project.proposeBurn(tokenType: tokenInfo.tokenType, amount: amount)
    } else if tokenSymbol == self.Project.projectTokenInfo.symbol {
      self.Project.proposeBurn(tokenType: self.Project.projectTokenInfo.tokenType, amount: amount)
    } else {
      panic("Not a correct token type for burning.")
    }
  }
}
 