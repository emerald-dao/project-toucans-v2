import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

access(all) fun main(user: Address, projectId: String, projectOwner: Address): UFix64 {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")

  let project = projectCollection.borrowProjectPublic(projectId: projectId)!

  if let vault = getAccount(user).capabilities.borrow<&{FungibleToken.Balance}>(project.projectTokenInfo.publicPath) {
    let contractAddressToString: String = project.projectTokenInfo.contractAddress.toString()
    let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(project.projectTokenInfo.contractName).concat(".Vault")
    if vault.getType().identifier == constructedIdentifier {
      return vault.balance
    }
  } 

  return 0.0
}