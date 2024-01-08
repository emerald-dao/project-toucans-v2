import Toucans from "../../Toucans.cdc"
import NFTCatalog from "../../utility/NFTCatalog.cdc"
import NonFungibleToken from "../../utility/NonFungibleToken.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Withdraw `nftIDs` from the treasury
// at `projectOwner` to `recipientAddr`

transaction(projectOwner: Address, projectId: String, collectionIdentifier: String, nftIDs: [UInt64], recipientAddr: Address) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let RecipientCollection: Capability<&{NonFungibleToken.Receiver}>
  let CatalogEntry: NFTCatalog.NFTCatalogMetadata
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    self.CatalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
          ?? panic("There is no NFT Catalog entry for this.")
    let publicPath: PublicPath = self.CatalogEntry.collectionData.publicPath

    self.RecipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.Receiver}>(publicPath)
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
    self.Project.proposeWithdrawNFTs(collectionType: collectionType, recipientCollection: self.RecipientCollection, nftIDs: nftIDs)
  }
}