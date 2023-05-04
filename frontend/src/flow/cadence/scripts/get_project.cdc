import ExampleToken from "../ExampleToken.cdc"
import Toucans from "../Toucans.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FiatToken from "../utility/FiatToken.cdc"
import NFTCatalog from "../utility/NFTCatalog.cdc"

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
  pub let extra: {String: AnyStruct}
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

  init(_ info: &Toucans.Project{Toucans.ProjectPublic}) {
    self.projectId = info.projectId
    self.tokenType = info.projectTokenInfo.tokenType
    self.currentFundingCycle = info.getCurrentFundingCycle()
    self.totalFunding = info.totalFunding
    self.editDelay = info.editDelay
    self.extra = info.getExtra()
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