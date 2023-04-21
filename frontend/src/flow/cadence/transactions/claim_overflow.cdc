import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  amount: UFix64 // the amount of project tokens youre sending in
) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let ExampleTokenVault: &ExampleToken.Vault
  let Receiver: &{FungibleToken.Receiver}
  
  prepare(signer: AuthAccount) {
    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
    self.ExampleTokenVault = signer.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)
                                ?? panic("User does not have ExampleToken Vault.")
    self.Receiver = signer.getCapability(/public/flowTokenReceiver)
                      .borrow<&{FungibleToken.Receiver}>()
                      ?? panic("User does not have receiver set up.")
  }
  execute {
    self.Project.claimOverflow(tokenVault: <- self.ExampleTokenVault.withdraw(amount: amount), receiver: self.Receiver)
  }
}