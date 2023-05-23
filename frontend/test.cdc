import FlowToken from 0x1654653399040a61

pub fun main(address: Address): Address {
  let cap = getAccount(address).getCapability<&FlowToken.Vault>(/public/nothing)
  return cap.address
}
