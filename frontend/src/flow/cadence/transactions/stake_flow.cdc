import Toucans from "../Toucans.cdc"

transaction(projectId: String, flowAmount: UFix64, stFlowAmountOutMin: UFix64) {

    let Project: &Toucans.Project

    prepare(signer: AuthAccount) {
        let collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
        self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
    }

    execute {
        self.Project.stakeFlow(flowAmount: flowAmount, stFlowAmountOutMin: stFlowAmountOutMin)
    }
}