import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  amount: UFix64, // the amount of project tokens youre sending in
  expectedAmount: UFix64
) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let ExampleTokenVault: &ExampleToken.Vault
  let Receiver: &{FungibleToken.Receiver, FungibleToken.Balance}
  
  prepare(signer: AuthAccount) {
    if signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      signer.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }

    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
    self.ExampleTokenVault = signer.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)
                                ?? panic("User does not have ExampleToken Vault.")
    self.Receiver = signer.borrow<&{FungibleToken.Receiver, FungibleToken.Balance}>(from: /storage/flowTokenVault)
                      ?? panic("User does not have receiver set up.")
  }
  
  execute {
    let currentBalance: UFix64 = self.Receiver.balance
    self.Project.claimOverflow(tokenVault: <- self.ExampleTokenVault.withdraw(amount: amount), receiver: self.Receiver)
    assert(
      (currentBalance + expectedAmount >= self.Receiver.balance - 1.0 && currentBalance + expectedAmount <= self.Receiver.balance + 1.0),
      message: "The expected amount of tokens was not minted."
    )
  }
}
 