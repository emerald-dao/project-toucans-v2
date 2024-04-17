import "FungibleToken"
import "FiatToken"
import "FlowToken"
import "Toucans"
import "ToucansTokens"

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
    /**************************************************************************************/
    /********************************** Setup USDC if not *********************************/
    /**************************************************************************************/
    if signer.storage.borrow<&FiatToken.Vault>(from: /storage/USDCVault) == nil {
      signer.storage.save(<- FiatToken.createEmptyVault(vaultType: Type<@FiatToken.Vault>()), to: /storage/USDCVault)
      let receiverCap = signer.capabilities.storage.issue<&FiatToken.Vault>(/storage/USDCVault)
      signer.capabilities.publish(receiverCap, at: /public/USDCVaultReceiver)

      let publicCap = signer.capabilities.storage.issue<&FiatToken.Vault>(/storage/USDCVault)
      signer.capabilities.publish(publicCap, at: /public/USDCVaultBalance)
    }

    // Blank empty for now
    let extra: {String: AnyStruct} = {}

    if signer.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = signer.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      signer.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    let toucansProjectCollection = signer.storage.borrow<auth(Toucans.Owner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.createProjectNoToken(
      projectId: projectId,
      paymentTokenInfo: ToucansTokens.TokenInfo(ptContractName, ptContractAddress, ptSymbol, ptReceiverPath, ptPublicPath, ptStoragePath), 
      initialAllowedNFTCollections: initialAllowedNFTCollections,
      extra: extra
    )
  }

}