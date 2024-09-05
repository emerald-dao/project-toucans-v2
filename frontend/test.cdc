import NonFungibleToken from "../utility/NonFungibleToken.cdc"

access(all) fun main() {
  let array: [Int] = [1, 2, 3]
  let thing = &array as auth(NonFungibleToken.Withdraw) &[Int]
}