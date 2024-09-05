import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

access(all) fun main(collectionIdentifier: String, user: Address): [UInt64] {
    let authAccount = getAuthAccount<auth(Storage) &Account>(user)
    if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.storage.borrow<&{NonFungibleToken.Collection}>(from: storagePath) {
            return userCollection.getIDs()
        }
    }
    return []
}