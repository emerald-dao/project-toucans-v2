import FungibleToken from "../utility/FungibleToken.cdc"
import Toucans from "../Toucans.cdc"

transaction(
  projectOwner: Address, 
  projectId: String, 
  lockedVaultUuid: UInt64,
  vaultReceiverPath: PublicPath
) {

  let Project: &Toucans.Project
  let Receiver: &{FungibleToken.Receiver}
  
  prepare(signer: auth(Storage, Capabilities) &Account) {
    if signer.storage.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) == nil {
      signer.storage.save(<- Toucans.createCollection(), to: Toucans.CollectionStoragePath)
      let cap = signer.capabilities.storage.issue<&Toucans.Collection>(Toucans.CollectionStoragePath)
      signer.capabilities.publish(cap, at: Toucans.CollectionPublicPath)
    }

    let collection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProjectPublic(projectId: projectId) ?? panic("Project does not exist.")

    self.Receiver = signer.capabilities.borrow<&{FungibleToken.Receiver}>(vaultReceiverPath)
                      ?? panic("User does not have receiver set up.")
  }
  
  execute {
    self.Project.claimLockedTokens(lockedVaultUuid: lockedVaultUuid, recipientVault: self.Receiver)
  }
}
 