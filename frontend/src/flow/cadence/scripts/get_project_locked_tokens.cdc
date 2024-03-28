import "Toucans"
import "ToucansLockTokens"

access(all) fun main(projectOwner: Address, projectId: String): [ToucansLockTokens.LockedVaultDetails] {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  return info.borrowLockTokensManagerPublic()?.getLockedVaultInfos() ?? []
}