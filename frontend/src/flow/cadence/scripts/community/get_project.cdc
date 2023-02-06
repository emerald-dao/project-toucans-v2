import ExampleCommunity from "../../ExampleCommunity.cdc"

pub fun main(user: Address): Info {
  return Info(ExampleCommunity.totalSupply, ExampleCommunity.getBalances())
}

pub struct Info { 
  pub let totalSupply: UFix64
  pub let balances: {Address: UFix64}

  init(_ totalSupply: UFix64, _ balances: {Address: UFix64}) {
    self.totalSupply = totalSupply
    self.balances = balances
  }
}