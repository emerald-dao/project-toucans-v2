import SloppyStakes from 	0x53f389d96fb4ce5e
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(user: Address): UFix64 {
  let projectTokenVault = getAccount(user).getCapability(SloppyStakes.VaultPublicPath)
                .borrow<&{FungibleToken.Balance}>()

  return projectTokenVault?.balance ?? 0.0
}