import FungibleToken from "../utility/FungibleToken.cdc"
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
  initialAllowedNFTCollections: [String]
) {

  prepare(deployer: auth(Storage, Capabilities, Contracts) &Account) {
    // Blank empty for now
    let extra: {String: AnyStruct} = {
      "initialAllowedNFTCollections": initialAllowedNFTCollections
    }

    deployer.contracts.add(
      name: contractName,
      code: contractCode.decodeHex(),
      _paymentTokenInfo: ToucansTokens.TokenInfo(ptContractName, ptContractAddress, ptSymbol, ptReceiverPath, ptPublicPath, ptStoragePath),
      _editDelay: editDelay,
      _minting: minting,
      _initialTreasurySupply: initialTreasurySupply,
      _maxSupply: maxSupply,
      _extra: extra
    )
  }

}