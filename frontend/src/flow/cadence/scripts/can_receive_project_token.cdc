import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

access(all) fun main(user: Address): Bool {
  // otherwise check the projects token
  let vault = getAccount(user).capabilities.borrow<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)

  return vault != nil
}