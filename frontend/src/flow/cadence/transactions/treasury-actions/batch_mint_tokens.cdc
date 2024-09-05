import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleToken from "../../ExampleToken.cdc"

transaction(projectId: String, projectOwner: Address, amounts: {Address: UFix64}) {

  let Project: &Toucans.Project

  prepare(signer: &Account) {
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>} = {}
    for wallet in amounts.keys {
      let cap = getAccount(wallet).capabilities.get<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
      assert(cap != nil, message: "Capability is nil for ".concat(wallet.toString()).concat("!"))
      assert(cap!.check(), message: "Invalid capability for ".concat(wallet.toString()).concat("!"))
      recipientVaults[wallet] = cap
    }
    self.Project.proposeBatchMint(recipientVaults: recipientVaults, amounts: amounts)
  }
}
 