import ExampleToken from "../ExampleToken.cdc"
import Toucans from "../Toucans.cdc"
import ToucansTreasuryActions from "../ToucansTreasuryActions.cdc"

pub fun main(projectOwner: Address, projectId: String): Info {
  let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  return Info(projectCollection.borrowProjectPublic(projectId: projectId)!)
}

pub struct Info {
  pub let projectId: String
  pub let tokenType: Type
  pub let currentFundingCycle: UInt64?
  pub let totalFunding: UFix64
  pub let editDelay: UFix64
  pub let extra: {String: AnyStruct}
  pub let fundingCycles: [Toucans.FundingCycle]
  pub let totalSupply: UFix64
  pub let overflowBalance: UFix64
  pub let balances: {Address: UFix64}
  pub let funders: {Address: UFix64}
  pub let signers: [Address]
  pub let actions: {UInt64: String}

  init(_ info: &Toucans.Project{Toucans.ProjectPublic}) {
    self.projectId = info.projectId
    self.tokenType = info.projectTokenInfo.tokenType
    self.currentFundingCycle = info.getCurrentFundingCycleNum()
    self.totalFunding = info.totalFunding
    self.editDelay = info.editDelay
    self.extra = info.getExtra()
    self.fundingCycles = info.getFundingCycles()
    self.totalSupply = ExampleToken.totalSupply
    self.balances = ExampleToken.getBalances()
    self.funders = info.getFunders()
    self.overflowBalance = info.getOverflowBalance()

    let manager = info.borrowManagerPublic()
    self.signers = manager.getSigners()
    self.actions = manager.getIntents()
  }
}