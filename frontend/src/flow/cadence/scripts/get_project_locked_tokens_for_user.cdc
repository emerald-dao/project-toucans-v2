import Toucans from "../Toucans.cdc"
import ToucansLockTokens from "../ToucansLockTokens.cdc"

pub fun main(projectOwner: Address, projectId: String, forUser: Address): [ToucansLockTokens.LockedVaultDetails] {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")
  
  let info = projectCollection.borrowProjectPublic(projectId: projectId)!

  return info.borrowLockTokensManagerPublic()?.getLockedVaultInfosForAddress(address: forUser) ?? []
}