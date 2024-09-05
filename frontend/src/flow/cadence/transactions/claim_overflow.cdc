// import ExampleToken from "../ExampleToken.cdc"
// import FungibleToken from "../utility/FungibleToken.cdc"
// import Toucans from "../Toucans.cdc"

// transaction(
//   projectOwner: Address, 
//   projectId: String, 
//   amount: UFix64, // the amount of project tokens youre sending in
//   expectedAmount: UFix64
// ) {

//   let Project: &Toucans.Project
//   let ExampleTokenVault: auth(FungibleToken.Withdraw) &ExampleToken.Vault
//   let Receiver: &{FungibleToken.Receiver, FungibleToken.Balance}
  
//   prepare(signer: auth(Storage, Capabilities) &Account) {
//     if signer.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
//       signer.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
//       let cap = signer.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
//       signer.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
//     }

//     let collection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
//                     ?? panic("A DAOTreasury doesn't exist here.")
//     self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")
//     self.ExampleTokenVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)
//                                 ?? panic("User does not have ExampleToken Vault.")
//     self.Receiver = signer.storage.borrow<&{FungibleToken.Receiver, FungibleToken.Balance}>(from: /storage/flowTokenVault)
//                       ?? panic("User does not have receiver set up.")
//   }
  
//   execute {
//     let currentBalance: UFix64 = self.Receiver.balance
//     self.Project.claimOverflow(tokenVault: <- self.ExampleTokenVault.withdraw(amount: amount), receiver: self.Receiver)
//     assert(
//       (currentBalance + expectedAmount >= self.Receiver.balance - 1.0 && currentBalance + expectedAmount <= self.Receiver.balance + 1.0),
//       message: "The expected amount of tokens was not minted."
//     )
//   }
// }
 