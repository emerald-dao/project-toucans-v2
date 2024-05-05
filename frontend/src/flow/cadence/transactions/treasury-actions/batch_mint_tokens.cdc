import FungibleToken from "../../utility/FungibleToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleToken from "../../ExampleToken.cdc"

transaction(projectId: String, projectOwner: Address, amounts: {Address: UFix64}) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}

  prepare(signer: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  execute {
    let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>} = {}
    for wallet in amounts.keys {
      let cap = getAccount(wallet).getCapability<&{FungibleToken.Receiver}>(ExampleToken.ReceiverPublicPath)
      if cap.check() {
        recipientVaults[wallet] = cap
      } else {
        amounts.remove(key: wallet)
      }
    }
    self.Project.proposeBatchMint(recipientVaults: recipientVaults, amounts: amounts)
  }
}
 