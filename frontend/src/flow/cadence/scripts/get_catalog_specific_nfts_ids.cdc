import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

pub fun main(collectionIdentifier: String, user: Address): [UInt64] {
    let authAccount = getAuthAccount(user)
    if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.borrow<&{MetadataViews.ResolverCollection}>(from: storagePath) {
            return userCollection.getIDs()
        }
    }
    return []
}