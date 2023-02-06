import FungibleToken from "../../utility/FungibleToken.cdc"
import FlowToken from "../../utility/FlowToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleFinancial from "../../ExampleFinancial.cdc"
import MetadataViews from "../../utility/MetadataViews.cdc"

transaction(projectOwner: Address, amount: UFix64) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Payment: @FlowToken.Vault
  let PayerTokenVault: &ExampleFinancial.Vault{FungibleToken.Receiver}

  prepare(user: AuthAccount) {
    // Setup User Account
    if user.borrow<&ExampleFinancial.Vault>(from: ExampleFinancial.VaultStoragePath) == nil {
      user.save(<- ExampleFinancial.createEmptyVault(), to: ExampleFinancial.VaultStoragePath)
      user.link<&ExampleFinancial.Vault{FungibleToken.Receiver}>(
          ExampleFinancial.ReceiverPublicPath,
          target: ExampleFinancial.VaultStoragePath
      )

      user.link<&ExampleFinancial.Vault{FungibleToken.Balance, MetadataViews.Resolver}>(
          ExampleFinancial.VaultPublicPath,
          target: ExampleFinancial.VaultStoragePath
      )
    }

    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProjectPublic(projectType: Type<@ExampleFinancial.Vault>())
                  ?? panic("Project does not exist, at least in this collection.")
    
    self.Payment <- user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    
    self.PayerTokenVault = user.getCapability(ExampleFinancial.ReceiverPublicPath)
                  .borrow<&ExampleFinancial.Vault{FungibleToken.Receiver}>()!
  }

  execute {
    self.Project.purchase(paymentTokens: <- self.Payment, payerTokenVault: self.PayerTokenVault)
  }
}