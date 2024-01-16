import Toucans from "../../Toucans.cdc"

transaction(projectId: String, stFlowAmount: UFix64, flowAmountOutMin: UFix64) {

    let Project: &Toucans.Project

    prepare(signer: AuthAccount) {
        let collection = signer.borrow<&Toucans.Collection>(from: Toucans.CollectionStoragePath)
                    ?? panic("A DAOTreasury doesn't exist here.")
        self.Project = collection.borrowProject(projectId: projectId) ?? panic("Project does not exist.")
    }

    execute {
        self.Project.proposeUnstakeFlow(stFlowAmount: stFlowAmount, flowAmountOutMin: flowAmountOutMin)
    }
}