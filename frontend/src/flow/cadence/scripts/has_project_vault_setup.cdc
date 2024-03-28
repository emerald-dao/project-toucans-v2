import "ExampleToken"
import "FungibleToken"
import "MetadataViews"

access(all) fun main(user: Address): Bool {
  // otherwise check the projects token
  let receiveVault = getAccount(user).capabilities.borrow<&ExampleToken.Vault>(ExampleToken.ReceiverPublicPath)

  let publicVault = getAccount(user).capabilities.borrow<&ExampleToken.Vault>(ExampleToken.VaultPublicPath)

  return receiveVault != nil && publicVault != nil
}