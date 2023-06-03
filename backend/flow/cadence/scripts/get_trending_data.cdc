import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import SwapInterfaces from "../utility/SwapInterfaces.cdc"
import SwapConfig from "../utility/SwapConfig.cdc"
import SwapFactory from "../utility/SwapFactory.cdc"

pub fun main(contractNames: [String], contractAddresses: [Address]): {String: Info} {
  let answer: {String: Info} = {}
  for i, contractName in contractNames {
    let contract = getAccount(contractAddresses[i]).contracts.borrow<&FungibleToken>(name: contractName)!
    let projectCollection = getAccount(contractAddresses[i]).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

    let project = projectCollection.borrowProjectPublic(projectId: contractName)!

    let projectCurrencyIdentifier: String = project.projectTokenInfo.tokenType.identifier
    let paymentCurrencyIdentifier: String = project.paymentTokenInfo.tokenType.identifier
    var pairInfo: [AnyStruct]? = nil
    if let pairAddress: Address = SwapFactory.getPairAddress(
      token0Key: projectCurrencyIdentifier.slice(from: 0, upTo: projectCurrencyIdentifier.length - 6), 
      token1Key: paymentCurrencyIdentifier.slice(from: 0, upTo: paymentCurrencyIdentifier.length - 6)
    ) {
      // GET PRICE
      let pairPublicRef = getAccount(pairAddress)
            .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
            .borrow()
            ?? panic("cannot borrow reference to PairPublic resource")

      pairInfo = pairPublicRef.getPairInfo()
    }

    answer[contractName] = Info(contract.totalSupply, pairInfo, project.paymentTokenInfo.symbol)
  }
  return answer
}

pub struct Info {
  pub let totalSupply: UFix64
  pub let pairInfo: [AnyStruct]?
  pub let paymentCurrency: String

  init(_ ts: UFix64, _ pi: [AnyStruct]?, _ pc: String) {
    self.totalSupply = ts
    self.pairInfo = pi
    self.paymentCurrency = pc
  }
}
