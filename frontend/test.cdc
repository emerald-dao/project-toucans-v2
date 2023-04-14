import FlowToken from 0x1654653399040a61

pub fun main(address: Address): Bool {
  let testVault = getAuthAccount(address).borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
  return testVault != nil
}
