import "NonFungibleToken"

access(all) fun main() {
  let array: [Int] = [1, 2, 3]
  let thing = &array as auth(NonFungibleToken.Withdraw) &[Int]
}