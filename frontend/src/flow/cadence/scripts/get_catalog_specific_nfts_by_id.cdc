import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

access(all) fun main(collectionIdentifier: String, user: Address, ids: [UInt64]): [NFTData] {
    let res: [NFTData] = []
    let authAccount = getAuthAccount<auth(Storage) &Account>(user)

    if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.storage.borrow<&{NonFungibleToken.Collection}>(from: storagePath) {
            for index, id in ids {
                let nft = userCollection.borrowViewResolver(id: id)!
                let display = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
                var serialNum: UInt64? = nil
                if let serialView = nft.resolveView(Type<MetadataViews.Serial>()) {
                    if let serial = serialView as? MetadataViews.Serial {
                        serialNum = serial.number
                    }
                }
                var traitsOpt: MetadataViews.Traits? = nil
                if let traitsView = nft.resolveView(Type<MetadataViews.Traits>()) {
                    if let traits = traitsView as? MetadataViews.Traits {
                        traitsOpt = traits
                    }
                }
                let nftData = NFTData(id, display.name, display.thumbnail.uri(), serialNum, traitsOpt)
                res.append(nftData)
            }
        }
    }
    return res
}

access(all) struct NFTData {
    access(all) let id: UInt64
    access(all) let name: String
    access(all) let thumbnail: String
    access(all) let serial: UInt64?
    access(all) let traits: [MetadataViews.Trait]

    init(_ id: UInt64, _ name: String, _ thumbnail: String, _ serial: UInt64?, _ traits: MetadataViews.Traits?) {
        self.id = id
        self.name = name
        self.thumbnail = thumbnail
        self.serial = serial
        self.traits = traits?.traits ?? []
    }
}
