import FungibleToken from "../utility/FungibleToken.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"
import ToucansTokens from "../ToucansTokens.cdc"

transaction(
  // PAYMENT TOKEN INFO
  ptContractName: String,
  ptContractAddress: Address,
  ptSymbol: String,
  ptReceiverPath: PublicPath,
  ptPublicPath: PublicPath,
  ptStoragePath: StoragePath
) {

  prepare(signer: AuthAccount) {
    /**************************************************************************************/
    /********************************** Setup USDC if not *********************************/
    /**************************************************************************************/
    if signer.borrow<&FiatToken.Vault>(from: /storage/USDCVault) == nil {
      signer.save(<- FiatToken.createEmptyVault(), to: /storage/USDCVault)
      signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(/public/USDCVaultReceiver, target: /storage/USDCVault)
      signer.link<&FiatToken.Vault{FungibleToken.Balance}>(/public/USDCVaultBalance, target: /storage/USDCVault)
    }

    /**************************************************************************************/
    /************************************ 200 $FLOW Fee ***********************************/
    /**************************************************************************************/
    let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: 200.0) as! @FlowToken.Vault
    let emeraldCityTreasury: &{FungibleToken.Receiver} = getAccount(0x5643fd47a29770e7).getCapability(/public/flowTokenReceiver)
                              .borrow<&{FungibleToken.Receiver}>()!

    // Blank empty for now
    let extra: {String: AnyStruct} = {}

    if signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      signer.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }

    let toucansProjectCollection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)!
    toucansProjectCollection.createProjectNoToken(
      paymentTokenInfo: ToucansTokens.TokenInfo(ptContractName, ptContractAddress, ptSymbol, ptReceiverPath, ptPublicPath, ptStoragePath), 
      extra: extra, 
      payment: <- payment
    )
  }

}