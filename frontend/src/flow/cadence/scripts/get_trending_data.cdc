import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

pub fun main(contractNames: [String], contractAddresses: [Address]): {String: Info} {
  let answer: {String: Info} = {}
  for i, contractName in contractNames {
    let contract = getAccount(contractAddresses[i]).contracts.borrow<&FungibleToken>(name: contractName)!
    let projectCollection = getAccount(contractAddresses[i]).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

    let project = projectCollection.borrowProjectPublic(projectId: contractName)!

    answer[contractName] = Info(contract.totalSupply, project.getCurrentFundingCycle()?.details?.issuanceRate, project.paymentTokenInfo.symbol)
  }
  return answer
}

pub struct Info {
  pub let totalSupply: UFix64
  pub let currentPrice: UFix64?
  pub let paymentCurrency: String

  init(_ ts: UFix64, _ cp: UFix64?, _ pc: String) {
    self.totalSupply = ts
    self.currentPrice = cp
    self.paymentCurrency = pc
  }
}
