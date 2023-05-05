import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleToken from "../../ExampleToken.cdc"

transaction(projectId: String, amounts: {Address: UFix64}) {

  let Project: &Toucans.Project

  prepare(owner: AuthAccount) {
    let projectCollection = owner.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>} = {}
    for wallet in amounts.keys {
      let cap = getAccount(wallet).getCapability<&ExampleToken.Vault{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
      assert(cap.check(), message: "Invalid capability for ".concat(wallet.toString()).concat("!"))
      recipientVaults[wallet] = cap
    }
    self.Project.proposeBatchMint(recipientVaults: recipientVaults, amounts: amounts)
  }
}
 