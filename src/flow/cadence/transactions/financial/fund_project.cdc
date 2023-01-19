import FungibleToken from "../../utility/FungibleToken.cdc"
import FlowToken from "../../utility/FlowToken.cdc"
import Toucans from "../../Toucans.cdc"
import ExampleFinancial from "../../ExampleFinancial.cdc"
import MetadataViews from "../../utility/MetadataViews.cdc"

transaction(projectOwner: Address, amount: UFix64) {

  prepare(user: AuthAccount) {
    let projectCollection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                  .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                  ?? panic("This is an incorrect address for project owner.")
    let publicProject = projectCollection.borrowProjectPublic(projectType: Type<@ExampleFinancial.Vault>())
                  ?? panic("Project does not exist, at least in this collection.")
    
    let paymentTokens <- user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: amount) as! @FlowToken.Vault
    
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
    let payerTokenVault = user.getCapability(ExampleFinancial.ReceiverPublicPath)
                  .borrow<&{FungibleToken.Receiver}>()!

    publicProject.purchase(paymentTokens: <- paymentTokens, payerTokenVault: payerTokenVault)
  }
}