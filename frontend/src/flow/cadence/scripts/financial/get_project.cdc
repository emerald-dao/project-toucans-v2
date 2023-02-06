import ExampleFinancial from "../../ExampleFinancial.cdc"
import Toucans from "../../Toucans.cdc"

pub fun main(user: Address, projectId: UInt64): Info {
  let projectCollection = getAccount(user).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  return Info(projectCollection.borrowProjectPublic(projectId: projectId)!)
}

pub struct Info {
  pub let projectId: UInt64
  pub let tokenType: Type
  pub let currentFundingCycle: UInt64?
  pub let totalFunding: UFix64
  pub let extra: {String: AnyStruct}
  pub let fundingCycles: [Toucans.FundingCycle]
  pub let totalSupply: UFix64
  pub let funders: {Address: UFix64}

  init(_ info: &Toucans.Project{Toucans.ProjectPublic}) {
    self.projectId = info.projectId
    self.tokenType = info.tokenType
    self.currentFundingCycle = info.getCurrentFundingCycleNum()
    self.totalFunding = info.totalFunding
    self.extra = info.getExtra()
    self.fundingCycles = info.getFundingCycles()
    self.totalSupply = ExampleFinancial.totalSupply
    self.funders = info.getFunders()
  }
}