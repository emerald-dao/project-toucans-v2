import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"

pub fun main(user: Address): Bool {
  // otherwise check the projects token
  let receiveVault = getAccount(user).getCapability(ExampleToken.ReceiverPublicPath)
                .borrow<&ExampleToken.Vault{FungibleToken.Receiver}>()

  let publicVault = getAccount(user).getCapability(ExampleToken.VaultPublicPath)
                .borrow<&ExampleToken.Vault{FungibleToken.Balance, MetadataViews.Resolver}>()

  return receiveVault != nil && publicVault != nil
}