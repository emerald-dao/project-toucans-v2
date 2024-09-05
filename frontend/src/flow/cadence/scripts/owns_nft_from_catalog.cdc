import NFTCatalog from "../utility/NFTCatalog.cdc"
import NonFungibleToken from "../utility/NonFungibleToken.cdc"
import EmeraldIdentity from "../utility/EmeraldIdentity.cdc"

access(all) fun main(user: Address, collectionIdentifier: String): Bool {
  if let entry: NFTCatalog.NFTCatalogMetadata = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
    let publicPath: PublicPath = entry.collectionData.publicPath
    let contractAddressToString: String = entry.contractAddress.toString()
    let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(entry.contractName).concat(".Collection")

    var addresses: [Address] = [user]
    if let discordID: String = EmeraldIdentity.getDiscordFromAccount(account: user) {
      addresses = EmeraldIdentity.getEmeraldIDs(discordID: discordID).values
    }
    assert(addresses.contains(user), message: "Should always be true. Just making sure so the user doesn't get punished accidentally ;)")
    for address in addresses {
      if let collection: &{NonFungibleToken.CollectionPublic} = getAccount(address).capabilities.borrow<&{NonFungibleToken.Collection}>(publicPath) {
        let identifier: String = collection.getType().identifier
        if identifier == constructedIdentifier && collection.getIDs().length > 0 {
          return true
        }
      }
    }
  }
  
  return false
}

