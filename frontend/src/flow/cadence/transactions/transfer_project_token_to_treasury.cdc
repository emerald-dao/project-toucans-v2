import Toucans from "../Toucans.cdc"
import ExampleToken from "../ExampleToken.cdc"

transaction(projectOwner: Address, projectId: String, amount: UFix64, message: String) {
 
  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Payment: @ExampleToken.Vault
  let Payer: Address

  prepare(user: AuthAccount) {
    if user.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      user.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      user.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }

    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.Payment <- user.borrow<&ExampleToken.Vault>(from: ExampleToken.VaultStoragePath)!.withdraw(amount: amount) as! @ExampleToken.Vault
    self.Payer = user.address          
  }

  execute {
    self.Project.transferProjectTokenToTreasury(vault: <- self.Payment, payer: self.Payer, message: message)
  }
}