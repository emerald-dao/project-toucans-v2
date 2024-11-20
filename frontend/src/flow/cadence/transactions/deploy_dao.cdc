import FungibleToken from "../utility/FungibleToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"
import ToucansTokens from "../ToucansTokens.cdc"

transaction(
  projectId: String,
  initialAllowedNFTCollections: [String],
  // PAYMENT TOKEN INFO
  ptContractName: String,
  ptContractAddress: Address,
  ptSymbol: String,
  ptReceiverPath: PublicPath,
  ptPublicPath: PublicPath,
  ptStoragePath: StoragePath
) {

  prepare(signer: auth(Storage, Capabilities) &Account) {
    // Blank empty for now
    let extra: {String: AnyStruct} = {}

    if signer.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = signer.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      signer.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    let toucansProjectCollection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.createProjectNoToken(
      projectId: projectId,
      paymentTokenInfo: ToucansTokens.TokenInfo(ptContractName, ptContractAddress, ptSymbol, ptReceiverPath, ptPublicPath, ptStoragePath), 
      initialAllowedNFTCollections: initialAllowedNFTCollections,
      extra: extra
    )
  }

}