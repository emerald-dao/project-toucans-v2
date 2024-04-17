import "ExampleToken"
import "FungibleToken"

access(all) fun main(user: Address): Bool {
  // otherwise check the projects token
  let vault = getAccount(user).capabilities.borrow<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)

  return vault != nil
}