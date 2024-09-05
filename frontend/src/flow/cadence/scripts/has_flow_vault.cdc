import FlowToken from "../utility/FlowToken.cdc"

access(all) fun main(address: Address): Bool {
  let testVault = getAuthAccount<auth(Storage) &Account>(address).storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
  return testVault != nil
}