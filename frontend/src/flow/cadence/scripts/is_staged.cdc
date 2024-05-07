import MigrationContractStaging from "../utility/MigrationContractStaging.cdc"

access(all) fun main(contractAddress: Address, contractName: String): Bool {
    return MigrationContractStaging.isStaged(address: contractAddress, name: contractName)
}