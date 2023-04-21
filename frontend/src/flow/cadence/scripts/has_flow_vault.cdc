import FlowToken from "../utility/FlowToken.cdc"

pub fun main(address: Address): Bool {
  let testVault = getAuthAccount(address).borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
  return testVault != nil
}