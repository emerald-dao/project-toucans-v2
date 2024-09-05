import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

access(all) fun main(collectionIdentifiers: [String], user: Address): {String: [NFTData]} {
  let res: {String: [NFTData]} = {}
  let authAccount = getAuthAccount<auth(Storage) &Account>(user)
  for collectionID in collectionIdentifiers {
      if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionID) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.storage.borrow<&{NonFungibleToken.Collection}>(from: storagePath) {
            if userCollection.getIDs().length == 0 {
                continue
            }
            let nfts: [NFTData] = []
            for index, id in userCollection.getIDs() {
                if index == 2000 {
                    break
                }
                let nft = userCollection.borrowViewResolver(id: id)!
                let display = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
                var serialNum: UInt64? = nil
                if let serialView = nft.resolveView(Type<MetadataViews.Serial>()) {
                    if let serial = serialView as? MetadataViews.Serial {
                        serialNum = serial.number
                    }
                }
                let nftData = NFTData(id, display.name, display.thumbnail.uri(), serialNum)
                nfts.append(nftData)
            }
            res[collectionID] = nfts
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

    init(_ id: UInt64, _ name: String, _ thumbnail: String, _ serial: UInt64?) {
        self.id = id
        self.name = name
        self.thumbnail = thumbnail
        self.serial = serial
    }
}
