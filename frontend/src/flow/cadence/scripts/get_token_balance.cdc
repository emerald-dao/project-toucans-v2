import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

pub fun main(user: Address, projectId: String, projectOwner: Address): UFix64 {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  let project = projectCollection.borrowProjectPublic(projectId: projectId)!

  if let vault = getAccount(user).getCapability(project.projectTokenInfo.publicPath).borrow<&{FungibleToken.Balance}>() {
    let contractAddressToString: String = project.projectTokenInfo.contractAddress.toString()
    let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(project.projectTokenInfo.contractName).concat(".Vault")
    if vault.getType().identifier == constructedIdentifier {
      return vault.balance
    }
  } 

  return 0.0
}