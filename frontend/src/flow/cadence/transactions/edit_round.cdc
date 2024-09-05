// This is the most basic script you can execute on Flow Network
import Toucans from "../Toucans.cdc"

transaction(
  projectId: String, 
  cycleIndex: UInt64, 
  // new options
  startTime: UFix64, 
  endTime: UFix64?, 
  reserveRate: UFix64, 
  issuanceRate: UFix64, 
  fundingTarget: UFix64?
) {

  let Project: auth(Toucans.ProjectOwner) &Toucans.Project
  
  prepare(signer: auth(Storage) &Account) {
    let collection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
  }

  execute {
    let cfc: Toucans.FundingCycleDetails = self.Project.getFundingCycle(cycleIndex: cycleIndex).details
    let details: Toucans.FundingCycleDetails = Toucans.FundingCycleDetails(
      cycleId: cfc.cycleId, 
      fundingTarget: fundingTarget, 
      issuanceRate: issuanceRate, 
      reserveRate: reserveRate, 
      timeframe: Toucans.CycleTimeFrame(startTime, endTime), 
      payouts: cfc.payouts, 
      allowOverflow: cfc.allowOverflow, 
      allowedAddresses: cfc.allowedAddresses, 
      catalogCollectionIdentifier: cfc.catalogCollectionIdentifier, 
      cfc.extra
    )
    self.Project.editUpcomingCycle(cycleIndex: cycleIndex, details: details)
  }
}
