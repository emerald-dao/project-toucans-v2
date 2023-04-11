import NFTCatalog from "../utility/NFTCatalog.cdc"

pub fun main(collectionIdentifiers: [String]): {String: Info} {
  let res: {String: Info} = {}
  for collectionID in collectionIdentifiers {
      if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionID) {
        res[collectionID] = Info(collectionID, data.collectionDisplay.name, data.collectionDisplay.squareImage.file.uri())
      }
  }
  return res
}

pub struct Info {
  pub let identifier: String
  pub let name: String
  pub let image: String 

  init(_ id: String, _ n: String, _ i: String) {
    self.identifier = id
    self.name = n
    self.image = i
  }
}