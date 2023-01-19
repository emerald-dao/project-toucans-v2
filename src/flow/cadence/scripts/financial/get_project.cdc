import ExampleFinancial from "../../ExampleFinancial.cdc"
import Toucans from "../../Toucans.cdc"

pub fun main(user: Address): Info {
  let projectCollection = getAccount(user).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

  return Info(projectCollection.borrowProjectPublic(projectType: Type<@ExampleFinancial.Vault>())!)
}

pub struct Info {
  pub let projectId: UInt64
  pub let tokenType: Type
  pub let currentFundingCycle: UInt64
  pub let totalBought: UFix64
  pub let extra: {String: AnyStruct}
  pub let fundingCycles: [Toucans.FundingCycle]
  pub let totalSupply: UFix64

  init(_ info: &Toucans.Project{Toucans.ProjectPublic}) {
    self.projectId = info.projectId
    self.tokenType = info.tokenType
    self.currentFundingCycle = info.currentFundingCycle
    self.totalBought = info.totalBought
    self.extra = info.extra
    self.fundingCycles = info.getFundingCycles()
    self.totalSupply = ExampleFinancial.totalSupply
  }
}