import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

pub fun main(collectionIdentifier: String, user: Address, ids: [UInt64]): [NFTData] {
    let res: [NFTData] = []
    let authAccount = getAuthAccount(user)

    if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.borrow<&{MetadataViews.ResolverCollection}>(from: storagePath) {
            for index, id in ids {
                let nft = userCollection.borrowViewResolver(id: id)
                let display = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
                var serialNum: UInt64? = nil
                if let serialView = nft.resolveView(Type<MetadataViews.Serial>()) {
                    if let serial = serialView as? MetadataViews.Serial {
                        serialNum = serial.number
                    }
                }
                let nftData = NFTData(id, display.name, display.thumbnail.uri(), serialNum)
                res.append(nftData)
            }
        }
    }
    return res
}

pub struct NFTData {
    pub let id: UInt64
    pub let name: String
    pub let thumbnail: String
    pub let serial: UInt64?

    init(_ id: UInt64, _ name: String, _ thumbnail: String, _ serial: UInt64?) {
        self.id = id
        self.name = name
        self.thumbnail = thumbnail
        self.serial = serial
    }
}
