import Toucans from "../Toucans.cdc"

pub fun main(projectOwner: Address, projectId: String): {String: [UInt64]} {
    let res: {String: [UInt64]} = {}
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("User does not have a Toucans Collection")
    let project = projectCollection.borrowProjectPublic(projectId: projectId)!

    for collectionType in project.getCollectionTypesInTreasury() {
        let collectionIds = project.getNFTIDs(collectionType: collectionType)
        res[collectionIdentifier] = collectionIds
    }
    return res
}