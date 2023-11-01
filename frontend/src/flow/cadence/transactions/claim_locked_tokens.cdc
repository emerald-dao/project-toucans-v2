import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  lockedVaultUuid: UInt64,
  vaultReceiverPath: PublicPath
) {

  let Project: &Toucans.Project{Toucans.ProjectPublic}
  let Receiver: &{FungibleToken.Receiver}
  
  prepare(signer: AuthAccount) {
    if signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      signer.link<&Toucans.Collection{Toucans.CollectionPublic}>(Toucans.CollectionPublicPath, target: Toucans.CollectionStoragePath)
    }

    let collection = getAccount(projectOwner).getCapability(Toucans.CollectionPublicPath)
                    .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    self.Receiver = signer.getCapability(vaultReceiverPath).borrow<&{FungibleToken.Receiver}>()
                      ?? panic("User does not have receiver set up.")
  }
  
  execute {
    self.Project.claimLockedTokens(lockedVaultUuid: lockedVaultUuid, recipientVault: self.Receiver)
  }
}
 