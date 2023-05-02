import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"

pub fun main(user: Address, collectionIdentifier: String): Bool {
  if let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
    let publicPath = data.collectionData.publicPath
    if let collection = getAccount(user).getCapability(publicPath).borrow<&{NonFungibleToken.CollectionPublic}>() {
      let identifier: String = collection.getType().identifier
      let contractAddressToString: String = data.contractAddress.toString()
      let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(data.contractName).concat(".Collection")
      if identifier == constructedIdentifier && collection.getIDs().length > 0 {
          return true
      }
    }
  }

  return false
}

