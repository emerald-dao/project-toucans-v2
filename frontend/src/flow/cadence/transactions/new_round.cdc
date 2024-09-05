import Toucans from "../Toucans.cdc"

transaction(
    projectId: String,
    fundingTarget: UFix64?, 
    issuanceRate: UFix64, 
    reserveRate: UFix64, 
    startTime: UFix64,
    endTime: UFix64?,
    payoutAddresses: [Address], 
    payoutAmounts: [UFix64],
    allowOverflow: Bool,
    allowedAddresses: [Address]?,
    catalogCollectionIdentifier: String?
) {

  let Project: auth(Toucans.ProjectOwner) &Toucans.Project

  prepare(signer: auth(Storage) &Account) {
    let projectCollection = signer.storage.borrow<auth(Toucans.CollectionOwner) &Toucans.Collection>(from: Toucans.CollectionStoragePath) ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  pre {
    payoutAddresses.length == payoutAmounts.length: "Must pass in the same amount of payout addresses and payout amounts."
  }

  execute {
    let extra: {String: AnyStruct} = {}
    let timeframe = Toucans.CycleTimeFrame(startTime, endTime)
    let payouts: [Toucans.Payout] = []
    for i, payoutAddress in payoutAddresses {
      payouts.append(Toucans.Payout(payoutAddresses[i], payoutAmounts[i]))
    }
     self.Project.configureFundingCycle(
      fundingTarget: fundingTarget, 
      issuanceRate: issuanceRate, 
      reserveRate: reserveRate,
      timeframe: timeframe, 
      payouts: payouts, 
      allowOverflow: allowOverflow,
      allowedAddresses: allowedAddresses, 
      catalogCollectionIdentifier: catalogCollectionIdentifier,
      extra: extra
    )
  }
}
