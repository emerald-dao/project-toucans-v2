import Toucans from "../../Toucans.cdc"
import NFTCatalog from "../../utility/NFTCatalog.cdc"
import NonFungibleToken from "../../utility/NonFungibleToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `nftIDs` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(projectOwner: Address, projectId: String, collectionIdentifier: String, nftIDs: [UInt64], recipientAddr: Address, message: String) {

  let Project: &Toucans.Project
  let RecipientCollectionReceiver: Capability<&{NonFungibleToken.Receiver}>
  let RecipientCollectionPublic: Capability<&{NonFungibleToken.CollectionPublic}>
  let CatalogEntry: NFTCatalog.NFTCatalogMetadata
  
  prepare(signer: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    self.CatalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
          ?? panic("There is no NFT Catalog entry for this.")
    let publicPath: PublicPath = self.CatalogEntry.collectionData.publicPath

    self.RecipientCollectionReceiver = getAccount(recipientAddr).capabilities.get<&{NonFungibleToken.Receiver}>(publicPath)
    self.RecipientCollectionPublic = getAccount(recipientAddr).capabilities.get<&{NonFungibleToken.CollectionPublic}>(publicPath)
  }

  execute {
    let contractAddressToString = self.CatalogEntry.contractAddress.toString()
    let collectionType = CompositeType(
      "A."
      .concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length))
      .concat(".")
      .concat(self.CatalogEntry.contractName)
      .concat(".Collection")
    )!
    self.Project.proposeWithdrawNFTs(collectionType: collectionType, recipientCollection: self.RecipientCollectionReceiver, nftIDs: nftIDs, message: message, self.RecipientCollectionPublic)
  }
}