import ExampleToken from "../ExampleToken.cdc"
import Toucans from "../Toucans.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import stFlowToken from "../utility/stFlowToken.cdc"
import NFTCatalog from "../utility/NFTCatalog.cdc"
import SwapInterfaces from "../utility/SwapInterfaces.cdc"
import SwapConfig from "../utility/SwapConfig.cdc"
import SwapFactory from "../utility/SwapFactory.cdc"

access(all) fun main(projectOwner: Address, projectId: String): Info {
  let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")

  return Info(projectCollection.borrowProjectPublic(projectId: projectId)!)
}

access(all) struct Info {
  access(all) let projectId: String
  access(all) let tokenType: Type
  access(all) let currentFundingCycle: Toucans.FundingCycle?
  access(all) let totalFunding: UFix64
  access(all) let editDelay: UFix64
  access(all) let fundingCycles: [Toucans.FundingCycle]
  access(all) let totalSupply: UFix64
  access(all) let overflowBalance: UFix64
  access(all) let balances: {Address: UFix64}
  access(all) let treasuryBalances: {String: UFix64}
  access(all) let signers: [Address]
  access(all) let threshold: UInt64
  access(all) let minting: Bool
  access(all) let paymentCurrency: String
  access(all) let maxSupply: UFix64?
  access(all) let purchasing: Bool
  access(all) let requiredNft: NFTData?
  access(all) var trading: Bool
  access(all) let allowedNFTCollections: [String]
  access(all) let lpAddresses: {String: Address}
  access(all) let completedActionIds: {UInt64: Bool}

  init(_ info: &Toucans.Project) {
    self.projectId = info.projectId
    self.tokenType = info.projectTokenInfo.tokenType
    self.currentFundingCycle = info.getCurrentFundingCycle()
    self.totalFunding = info.totalFunding
    self.editDelay = info.editDelay
    self.fundingCycles = info.getFundingCycles()
    self.totalSupply = ExampleToken.totalSupply
    self.balances = ExampleToken.getBalances()
    self.overflowBalance = info.getOverflowBalance()
    self.minting = info.minting
    self.treasuryBalances = {
      "FLOW": info.getVaultBalanceInTreasury(vaultType: Type<@FlowToken.Vault>()) ?? 0.0,
      "USDC": info.getVaultBalanceInTreasury(vaultType: Type<@FiatToken.Vault>()) ?? 0.0,
      info.paymentTokenInfo.symbol: info.getVaultBalanceInTreasury(vaultType: info.paymentTokenInfo.tokenType) ?? 0.0,
      info.projectTokenInfo.symbol: info.getVaultBalanceInTreasury(vaultType: Type<@ExampleToken.Vault>()) ?? 0.0
    }
    if let stFlowBalance = info.getVaultBalanceInTreasury(vaultType: Type<@stFlowToken.Vault>()) {
      if stFlowBalance > 0.001 {
        self.treasuryBalances["stFlow"] = stFlowBalance
      }
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
    if let allowedNFTCollections = info.getExtra()["allowedNFTCollections"] {
      self.allowedNFTCollections = (allowedNFTCollections as! {String: Bool}).keys
    } else {
      self.allowedNFTCollections = []
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

access(all) struct NFTData {
  access(all) let identifier: String
  access(all) let name: String
  access(all) let image: String
  access(all) let link: String 

  init(collectionIdentifier: String) {
    let data = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
    self.identifier = collectionIdentifier
    self.name = data.collectionDisplay.name
    self.image = data.collectionDisplay.squareImage.file.uri()
    self.link = data.collectionDisplay.externalURL.url
  }
}

