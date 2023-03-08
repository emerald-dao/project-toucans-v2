import Toucans from "../Toucans.cdc"

pub fun main(projectOwner: Address, projectId: String): {UInt64: String} {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  return projectCollection.borrowProjectPublic(projectId: projectId)!.borrowManagerPublic().getIntents()
}

