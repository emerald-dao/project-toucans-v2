import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import SwapInterfaces from "../utility/SwapInterfaces.cdc"
import SwapConfig from "../utility/SwapConfig.cdc"
import SwapFactory from "../utility/SwapFactory.cdc"

access(all) fun main(contractNames: [String], contractAddresses: [Address]): {String: Info} {
  let answer: {String: Info} = {}
  for i, contractName in contractNames {
    let contract = getAccount(contractAddresses[i]).contracts.borrow<&{FungibleToken}>(name: contractName)!
    let projectCollection = getAccount(contractAddresses[i]).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
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
            .capabilities.borrow<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
            ?? panic("cannot borrow reference to PairPublic resource")

      pairInfo = pairPublicRef.getPairInfo()
    }

    answer[contractName] = Info(contract.totalSupply, pairInfo, project.paymentTokenInfo.symbol)
  }
  return answer
}

access(all) struct Info {
  access(all) let totalSupply: UFix64
  access(all) let pairInfo: [AnyStruct]?
  access(all) let paymentCurrency: String

  init(_ ts: UFix64, _ pi: [AnyStruct]?, _ pc: String) {
    self.totalSupply = ts
    self.pairInfo = pi
    self.paymentCurrency = pc
  }
}
