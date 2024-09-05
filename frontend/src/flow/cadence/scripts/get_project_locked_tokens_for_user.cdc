import Toucans from "../Toucans.cdc"
import ToucansLockTokens from "../ToucansLockTokens.cdc"

access(all) fun main(projectOwner: Address, projectId: String, forUser: Address): [ToucansLockTokens.LockedVaultDetails] {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  return info.borrowLockTokensManagerPublic()?.getLockedVaultInfosForAddress(address: forUser) ?? []
}