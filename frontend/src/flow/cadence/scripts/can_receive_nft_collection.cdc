import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"

pub fun main(user: Address, collectionIdentifier: String): Bool {

  // if the token symbol is for payments
  if let catalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
    let publicPath: PublicPath = catalogEntry.collectionData.publicPath
    if let collectionReceiver = getAccount(user).getCapability(publicPath).borrow<&{NonFungibleToken.Receiver}>() {
      return true
    }
    if let collectionPublic = getAccount(user).getCapability(publicPath).borrow<&{NonFungibleToken.CollectionPublic}>() {
      return true
    }
  }

  return false
}