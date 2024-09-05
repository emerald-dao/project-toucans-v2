import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"
import FlowToken from "../utility/FlowToken.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String) {
 
  let Project: &Toucans.Project
  let Payment: @FlowToken.Vault
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
    
    self.Payment <- user.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    self.Payer = user.address          
  }

  execute {
    self.Project.donateToTreasury(vault: <- self.Payment, payer: self.Payer, message: message)
  }
}