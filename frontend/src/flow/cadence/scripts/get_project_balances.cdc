import "FungibleToken"
import "Toucans"

access(all) fun main(user: Address, projects: {String: Address}): {String: UFix64} {
  let answer: {String: UFix64} = {}
  for projectId in projects.keys {
    let owner: Address = projects[projectId]!
    let projectCollection = getAccount(owner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
    let project = projectCollection.borrowProjectPublic(projectId: projectId)!

    if let vault = getAccount(user).capabilities.borrow<&{FungibleToken.Balance}>(project.projectTokenInfo.publicPath) {
      let contractAddressToString: String = project.projectTokenInfo.contractAddress.toString()
      let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(project.projectTokenInfo.contractName).concat(".Vault")
      if vault.getType().identifier == constructedIdentifier {
        answer[projectId] = vault.balance
      }
    } 
  }

  let flowVault = getAccount(user).capabilities.borrow<&{FungibleToken.Balance}>(/public/flowTokenBalance)!
  answer["Flow"] = flowVault.balance

  let usdcVault = getAccount(user).getCapability(/public/USDCVaultBalance).borrow<&{FungibleToken.Balance}>()
  answer["USDC"] = usdcVault?.balance ?? 0.0

  let stFlowVault = getAccount(user).getCapability(/public/stFlowTokenBalance).borrow<&{FungibleToken.Balance}>()
  answer["stFlow"] = stFlowVault?.balance ?? 0.0
  
  return answer
}