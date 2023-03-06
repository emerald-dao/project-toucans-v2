import FungibleToken from "../utility/FungibleToken.cdc"
import FUSD from "../utility/FUSD.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"

transaction(
  contractName: String,
  editDelay: UFix64,
  contractCode: String,
  // PAYMENT TOKEN INFO
  ptContractName: String,
  ptContractAddress: Address,
  ptReceiverPath: PublicPath,
  ptPublicPath: PublicPath,
  ptStoragePath: StoragePath,
  // DAO TREASURY
  signers: [Address],
  threshold: UInt64,
  minting: Bool
) {

  prepare(deployer: AuthAccount) {
    /**************************************************************************************/
    /********************************** Setup FUSD if not *********************************/
    /**************************************************************************************/
    if deployer.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
      deployer.save(<- FUSD.createEmptyVault(), to: /storage/fusdVault)
      deployer.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
      deployer.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
    }

    // Blank empty for now
    let extra: {String: AnyStruct} = {}

    // Make sure the initial signers includes the deployer
    var initialSigners: [Address] = signers
    if initialSigners.contains(deployer.address) {
      initialSigners.append(deployer.address)
    }

    deployer.contracts.add(
      name: contractName,
      code: contractCode.decodeHex(),
      _paymentTokenInfo: Toucans.TokenInfo(ptContractName, ptContractAddress, ptReceiverPath, ptPublicPath, ptStoragePath),
      _editDelay: editDelay,
      _signers: initialSigners,
      _threshold: threshold,
      _minting: minting,
      _extra: extra
    )
  }

}