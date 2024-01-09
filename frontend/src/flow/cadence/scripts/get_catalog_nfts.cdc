import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

pub fun main(collectionIdentifiers: [String], user: Address): {String: [NFTData]} {
  let res: {String: [NFTData]} = {}
  let authAccount = getAuthAccount(user)
  for collectionID in collectionIdentifiers {
      if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionID) {
        let storagePath = data.collectionData.storagePath
        if let userCollection = authAccount.borrow<&{MetadataViews.ResolverCollection}>(from: storagePath) {
            if userCollection.getIDs().length == 0 {
                continue
            }
            let nfts: [NFTData] = []
            for id in userCollection.getIDs() {
                let nft = userCollection.borrowViewResolver(id: id)
                let display = nft.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
                let nftData = NFTData(id, display.name, display.thumbnail.uri())
                nfts.append(nftData)
            }
            res[collectionID] = nfts
        }

      }
  }
  return res
}

pub struct NFTData {
    pub let id: UInt64
    pub let name: String
    pub let thumbnail: String

    init(_ id: UInt64, _ name: String, _ thumbnail: String) {
        self.id = id
        self.name = name
        self.thumbnail = thumbnail
    }
}
