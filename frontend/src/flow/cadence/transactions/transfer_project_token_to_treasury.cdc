import Toucans from "../Toucans.cdc"
import ExampleToken from "../ExampleToken.cdc"
import FungibleToken from "../utility/FungibleToken.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String) {

  let Project: &Toucans.Project
  let Payment: @ExampleToken.Vault
  let Payer: Address

  prepare(user: auth(Storage, Capabilities) &Account) {
    if user.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = user.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      user.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.Payment <- user.storage.borrow<auth(FungibleToken.Withdraw) &ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)!.withdraw(amount: amount) as! @ExampleToken.Vault
    self.Payer = user.address          
  }

  execute {
    self.Project.transferProjectTokenToTreasury(vault: <- self.Payment, payer: self.Payer, message: message)
  }
}