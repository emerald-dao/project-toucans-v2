import Toucans from "../Toucans.cdc"
import ToucansTokens from "../ToucansTokens.cdc"

transaction(projectId: String) {

  let Project: &Toucans.Project
  let Minter: @{Toucans.Minter}

  prepare(signer: AuthAccount) {
    let collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")

    self.Minter <- // INSERT MINTER HERE
  }

  execute {
    let projectTokenInfo = ToucansTokens.TokenInfo(
        "FlovatarDustToken",
        0x921ea449dffec68a,
        "DUST",
        /public/FlovatarDustTokenReceiver,
        /public/FlovatarDustTokenBalance,
        /storage/FlovatarDustTokenVault
    )
    self.Project.evolve(projectTokenInfo: projectTokenInfo, minter: <- self.Minter, initialTreasurySupply: 0.0, editDelay: 0.0)
  }
}
