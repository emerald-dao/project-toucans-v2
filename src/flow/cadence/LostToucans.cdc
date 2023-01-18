import FungibleToken from "./utility/FungibleToken.cdc"
import ToucanRegistry from "./ToucanRegistry.cdc"

// Tokens that end up here must be a part of the ToucanRegistry.
pub contract LostToucans {
  access(self) let vaults: @{Address: {Type: FungibleToken.Vault}}

  pub fun depositToucans(vault: @FungibleToken.Vault, to: Address) {
    if let userBuckets = &self.vaults[to] as &{Type: FungibleToken.Vault}? {
      if let userBucket = &userBuckets[vault.getType()] as &FungibleToken.Vault? {
        userBucket.deposit(from: <- vault)
      } else {
        userBuckets[vault.getType()] <-! vault
      }
    } else {
      self.vaults[to] <-! {vault.getType(): <- vault}
    }
  }

  pub fun claimToucans(receiver: &{FungibleToken.Receiver}) {
    let receiverAddr = receiver.owner!.address
    if let userBuckets = &self.vaults[receiverAddr] as &{Type: FungibleToken.Vault}? {
      if let lost: @FungibleToken.Vault <- userBuckets.remove(key: receiver.getType()) {
        receiver.deposit(from: <- lost)
      }
    }
  }

  init() {
    self.vaults <- {}
  }
}