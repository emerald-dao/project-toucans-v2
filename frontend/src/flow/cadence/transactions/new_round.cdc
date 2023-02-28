import Toucans from "../../Toucans.cdc"

transaction(
    projectId: UInt64,
    fundingTarget: UFix64?, 
    issuanceRate: UFix64, 
    reserveRate: UFix64, 
    startTime: UFix64,
    endTime: UFix64?,
    payoutAddresses: [Address], 
    payoutAmounts: [UFix64], 
    extra: {String: String}
) {

  let Project: &Toucans.Project

  prepare(signer: AuthAccount) {
    let projectCollection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath) ?? panic("This is an incorrect address for project owner.")
    self.Project = projectCollection.borrowProject(projectId: projectId)
                  ?? panic("Project does not exist, at least in this collection.")
  }

  pre {
    payoutAddresses.length == payoutAmounts.length: "Must pass in the same amount of payout addresses and payout amounts."
  }

  execute {
    let timeframe = Toucans.CycleTimeFrame(startTime, endTime)
    let payouts: [Toucans.Payout] = []
    for i, payoutAddress in payoutAddresses {
      payouts.append(Toucans.Payout(payoutAddresses[i], payoutAmounts[i]))
    }
     self.Project.configureFundingCycle(fundingTarget: fundingTarget, issuanceRate: issuanceRate, reserveRate: reserveRate, timeframe: timeframe, payouts: payouts, extra: extra)
  }
}
