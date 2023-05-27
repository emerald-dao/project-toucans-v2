// This is the most basic script you can execute on Flow Network
import Toucans from "../Toucans.cdc"

transaction(projectId: String, cycleIndex: UInt64) {

  let Project: &Toucans.Project
  
  prepare(signer: AuthAccount) {
    let collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
  }

  execute {
    let cfc: Toucans.FundingCycleDetails = self.Project.getFundingCycle(cycleIndex: cycleIndex).details
    let details: Toucans.FundingCycleDetails = Toucans.FundingCycleDetails(
      cycleId: cfc.cycleId, 
      fundingTarget: cfc.fundingTarget, 
      issuanceRate: cfc.issuanceRate, 
      reserveRate: cfc.reserveRate, 
      timeframe: cfc.timeframe, 
      payouts: cfc.payouts, 
      allowOverflow: cfc.allowOverflow, 
      allowedAddresses: cfc.allowedAddresses, 
      catalogCollectionIdentifier: cfc.catalogCollectionIdentifier, 
      cfc.extra
    )
    self.Project.editUpcomingCycle(cycleIndex: cycleIndex, details: details)
  }
}
