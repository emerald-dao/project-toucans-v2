import FungibleToken from "../../utility/FungibleToken.cdc"
import FUSD from "../../utility/FUSD.cdc"

transaction(
  contractName: String,
  initialTotalSupply: UFix64,
  contractCode: String
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

    deployer.contracts.add(
      name: contractName, 
      code: contractCode.decodeHex(),
      _initialTotalSupply: initialTotalSupply
    )
  }

}