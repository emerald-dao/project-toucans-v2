import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

pub fun main(user: Address): Bool {
  let vault = getAccount(user).getCapability(ExampleToken.ReceiverPublicPath)
                .borrow<&{FungibleToken.Receiver}>()

  return vault != nil
}