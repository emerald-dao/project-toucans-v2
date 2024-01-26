import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

pub fun main(user: Address, projects: {String: Address}): {String: UFix64} {
  let answer: {String: UFix64} = {}
  for projectId in projects.keys {
    let owner: Address = projects[projectId]!
    let projectCollection = getAccount(owner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")
    let project = projectCollection.borrowProjectPublic(projectId: projectId)!

    if let vault = getAccount(user).getCapability(project.projectTokenInfo.publicPath).borrow<&{FungibleToken.Balance}>() {
      let contractAddressToString: String = project.projectTokenInfo.contractAddress.toString()
      let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(project.projectTokenInfo.contractName).concat(".Vault")
      if vault.getType().identifier == constructedIdentifier {
        answer[projectId] = vault.balance
      }
    } 
  }

  let flowVault = getAccount(user).getCapability(/public/flowTokenBalance).borrow<&{FungibleToken.Balance}>()!
  answer["Flow"] = flowVault.balance
  
  return answer
}