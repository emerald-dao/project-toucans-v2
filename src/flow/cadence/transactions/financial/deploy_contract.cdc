import FungibleToken from "../../utility/FungibleToken.cdc"
import FUSD from "../../utility/FUSD.cdc"
import FlowToken from "../../utility/FlowToken.cdc"
import Toucans from "../../Toucans.cdc"

transaction(
  contractName: String,
  fundingTarget: UFix64, 
  initialFlowTokenIssuanceRate: UFix64,
  reserveRate: UFix64,
  payouts: {Address: UFix64},
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

    let extra: {String: String} = {}
    let payoutsArray: [Toucans.Payout] = []
    for payoutAddr in payouts.keys {
      payoutsArray.append(Toucans.Payout(address: payoutAddr, percent: payouts[payoutAddr]!))
    }

    deployer.contracts.add(
      name: contractName,
      code: contractCode.decodeHex(),
      _fundingTarget: fundingTarget, 
      _issuanceRate: initialFlowTokenIssuanceRate,
      _reserveRate: reserveRate,
      _timeFrame: Toucans.CycleTimeFrame(startTime: getCurrentBlock().timestamp, getCurrentBlock().timestamp + 1000.0),
      _payouts: payoutsArray,
      _extra: extra
    )
  }

}