import ExampleToken from "../ExampleToken.cdc"
import Toucans from "../Toucans.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import NFTCatalog from "../utility/NFTCatalog.cdc"
import SwapInterfaces from "../utility/SwapInterfaces.cdc"
import SwapConfig from "../utility/SwapConfig.cdc"
import SwapFactory from "../utility/SwapFactory.cdc"

pub fun main(projectOwner: Address, projectId: String): Info {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  return Info(projectCollection.borrowProjectPublic(projectId: projectId)!)
}

pub struct Info {
  pub let projectId: String
  pub let tokenType: Type
  pub let currentFundingCycle: Toucans.FundingCycle?
  pub let totalFunding: UFix64
  pub let editDelay: UFix64
  pub let fundingCycles: [Toucans.FundingCycle]
  pub let totalSupply: UFix64
  pub let overflowBalance: UFix64
  pub let balances: {Address: UFix64}
  pub let treasuryBalances: {String: UFix64}
  pub let funders: {Address: UFix64}
  pub let signers: [Address]
  pub let threshold: UInt64
  pub let minting: Bool
  pub let paymentCurrency: String
  pub let maxSupply: UFix64?
  pub let purchasing: Bool
  pub let requiredNft: NFTData?
  pub var trading: Bool
  pub let lpAddresses: {String: Address}
  pub let completedActionIds: {UInt64: Bool}

  init(_ info: &Toucans.Project{Toucans.ProjectPublic}) {
    self.projectId = info.projectId
    self.tokenType = info.projectTokenInfo.tokenType
    self.currentFundingCycle = info.getCurrentFundingCycle()
    self.totalFunding = info.totalFunding
    self.editDelay = info.editDelay
    self.fundingCycles = info.getFundingCycles()
    self.totalSupply = ExampleToken.totalSupply
    self.balances = ExampleToken.getBalances()
    self.funders = info.getFunders()
    self.overflowBalance = info.getOverflowBalance()
    self.minting = info.minting
    self.treasuryBalances = {
      "FLOW": info.getVaultBalanceInTreasury(vaultType: Type<@FlowToken.Vault>()) ?? 0.0,
      "USDC": info.getVaultBalanceInTreasury(vaultType: Type<@FiatToken.Vault>()) ?? 0.0,
      info.paymentTokenInfo.symbol: info.getVaultBalanceInTreasury(vaultType: info.paymentTokenInfo.tokenType) ?? 0.0,
      info.projectTokenInfo.symbol: info.getVaultBalanceInTreasury(vaultType: Type<@ExampleToken.Vault>()) ?? 0.0
    }
    self.paymentCurrency = info.paymentTokenInfo.symbol
    self.maxSupply = ExampleToken.maxSupply
    self.purchasing = info.purchasing

    let manager = info.borrowManagerPublic()
    self.signers = manager.getSigners()
    self.threshold = manager.threshold

    // required nft if active cycle
    if let currentCycle = info.getCurrentFundingCycle() {
      if let collectionIdentifier = currentCycle.details.catalogCollectionIdentifier {
        self.requiredNft = NFTData(collectionIdentifier: collectionIdentifier)
      } else {
        self.requiredNft = nil
      }
    } else {
      self.requiredNft = nil
    }

    let projectCurrencyIdentifier: String = info.projectTokenInfo.tokenType.identifier
    let usdcCurrencyIdentifier: String = Type<@FiatToken.Vault>().identifier
    let flowCurrencyIdentifier: String = Type<@FlowToken.Vault>().identifier  
    self.trading = false  
    self.lpAddresses = {}
    if let pairAddress: Address = SwapFactory.getPairAddress(
      token0Key: projectCurrencyIdentifier.slice(from: 0, upTo: projectCurrencyIdentifier.length - 6), 
      token1Key: usdcCurrencyIdentifier.slice(from: 0, upTo: usdcCurrencyIdentifier.length - 6)
    ) {
      self.lpAddresses["USDC"] = pairAddress
      self.trading = true
    }
    if let pairAddress: Address = SwapFactory.getPairAddress(
      token0Key: projectCurrencyIdentifier.slice(from: 0, upTo: projectCurrencyIdentifier.length - 6), 
      token1Key: flowCurrencyIdentifier.slice(from: 0, upTo: flowCurrencyIdentifier.length - 6)
    ) {
      self.lpAddresses["FLOW"] = pairAddress
      self.trading = true
    }
    self.completedActionIds = info.getCompletedActionIds()
  }
}

pub struct NFTData {
  pub let identifier: String
  pub let name: String
  pub let image: String
  pub let link: String 

  init(collectionIdentifier: String) {
    let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
    self.identifier = collectionIdentifier
    self.name = data.collectionDisplay.name
    self.image = data.collectionDisplay.squareImage.file.uri()
    self.link = data.collectionDisplay.externalURL.url
  }
}

