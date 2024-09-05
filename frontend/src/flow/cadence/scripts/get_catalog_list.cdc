import NFTCatalog from "../utility/NFTCatalog.cdc"

access(all) fun main(collectionIdentifiers: [String]): {String: Info} {
  let res: {String: Info} = {}
  for collectionID in collectionIdentifiers {
      if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionID) {
        res[collectionID] = Info(collectionID, data.collectionDisplay.name, data.collectionDisplay.squareImage.file.uri())
      }
  }
  return res
}

access(all) struct Info {
  access(all) let identifier: String
  access(all) let name: String
  access(all) let image: String 

  init(_ id: String, _ n: String, _ i: String) {
    self.identifier = id
    self.name = n
    self.image = i
  }
}