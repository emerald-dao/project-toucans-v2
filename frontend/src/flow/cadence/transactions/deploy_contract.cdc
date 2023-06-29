import FungibleToken from "../utility/FungibleToken.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import Toucans from "../Toucans.cdc"
import ToucansTokens from "../ToucansTokens.cdc"

transaction(
  contractName: String,
  editDelay: UFix64,
  contractCode: String,
  // PAYMENT TOKEN INFO
  ptContractName: String,
  ptContractAddress: Address,
  ptSymbol: String,
  ptReceiverPath: PublicPath,
  ptPublicPath: PublicPath,
  ptStoragePath: StoragePath,
  // Minting
  minting: Bool,
  // Supply
  initialTreasurySupply: UFix64,
  maxSupply: UFix64?,
) {

  prepare(deployer: AuthAccount) {
    /**************************************************************************************/
    /********************************** Setup USDC if not *********************************/
    /**************************************************************************************/
    if deployer.borrow<&FiatToken.Vault>(from: /storage/USDCVault) == nil {
      deployer.save(<- FiatToken.createEmptyVault(), to: /storage/USDCVault)
      deployer.link<&FiatToken.Vault{FungibleToken.Receiver}>(/public/USDCVaultReceiver, target: /storage/USDCVault)
      deployer.link<&FiatToken.Vault{FungibleToken.Balance}>(/public/USDCVaultBalance, target: /storage/USDCVault)
    }

    /**************************************************************************************/
    /************************************ 200 $FLOW Fee ***********************************/
    /**************************************************************************************/
    let payment <- deployer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: 200.0) as! @FlowToken.Vault
    let emeraldCityTreasury: &{FungibleToken.Receiver} = getAccount(0x5643fd47a29770e7).getCapability(/public/flowTokenReceiver)
                              .borrow<&{FungibleToken.Receiver}>()!

    // Blank empty for now
    let extra: {String: AnyStruct} = {}

    deployer.contracts.add(
      name: contractName,
      code: contractCode.decodeHex(),
      _paymentTokenInfo: ToucansTokens.TokenInfo(ptContractName, ptContractAddress, ptSymbol, ptReceiverPath, ptPublicPath, ptStoragePath),
      _editDelay: editDelay,
      _minting: minting,
      _initialTreasurySupply: initialTreasurySupply,
      _maxSupply: maxSupply,
      _extra: extra,
      _payment: <- payment
    )
  }

}