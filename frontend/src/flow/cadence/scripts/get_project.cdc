import ExampleToken from "../ExampleToken.cdc"
import Toucans from "../Toucans.cdc"
import ToucansTreasuryActions from "../ToucansTreasuryActions.cdc"
import ToucansMultiSign from "../ToucansMultiSign.cdc"
import FlowToken from "../utility/FlowToken.cdc"
import FUSD from "../utility/FUSD.cdc"

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
  pub let treasuryBalances: {String: UFix64}
  pub let funders: {Address: UFix64}
  pub let signers: [Address]
  pub let threshold: UInt64
  pub let actions: [Action]
  pub let minting: Bool

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
    self.minting = info.minting
    self.treasuryBalances = {
      "FUSD": info.getVaultBalanceInTreasury(vaultType: Type<@FlowToken.Vault>()) ?? 0.0,
      "FUSD": info.getVaultBalanceInTreasury(vaultType: Type<@FUSD.Vault>()) ?? 0.0,
      "ExampleToken": info.getVaultBalanceInTreasury(vaultType: Type<@ExampleToken.Vault>()) ?? 0.0
    }

    let manager = info.borrowManagerPublic()
    self.signers = manager.getSigners()
    self.threshold = manager.threshold
    self.actions = []
    for actionId in manager.getIDs() {
      let action = manager.borrowAction(actionUUID: actionId)
      let actionDetails = action.getAction()
      self.actions.append(Action(actionId, actionDetails.intent, actionDetails.title, action.getVotes()))
    }
  }
}

pub struct Action {
  pub let id: UInt64
  pub let intent: String
  pub let title: String
  pub let votes: {Address: Bool}

  init(_ id: UInt64, _ i: String, _ t: String, _ s: {Address: Bool}) {
    self.id = id
    self.intent = i
    self.title = t
    self.votes = s
  }
}