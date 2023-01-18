// These are tokens we allow to be used as payment.

pub contract ToucanRegistry {

    access(self) let registry: {Type: TokenInfo}

    pub struct TokenInfo {
        pub let receiverPath: PublicPath
        pub let publicPath: PublicPath
        pub let storagePath: StoragePath
        pub let identifier: String
        pub let contractAddress: Address
        pub let contractName: String
        pub let others: {String: String}

        init(
            receiverPath: PublicPath,
            publicPath: PublicPath,
            storagePath: StoragePath,
            contractAddress: Address,
            contractName: String,
            others: {String: String}
        ) {
            self.receiverPath = receiverPath
            self.publicPath = publicPath
            self.storagePath = storagePath
            let addrAsString = contractAddress.toString()
            self.identifier = "A.".concat(addrAsString.slice(from: 2, upTo: addrAsString.length)).concat(".").concat(contractName).concat(".Vault")
            self.contractAddress = contractAddress
            self.contractName = contractName
            self.others = others
        }
    }

    pub resource Admin {
        pub fun addToken(
            type: Type,
            receiverPath: PublicPath,
            publicPath: PublicPath,
            storagePath: StoragePath,
            contractAddress: Address,
            contractName: String,
            others: {String: String}
        ) {
            ToucanRegistry.registry[type] = TokenInfo(
                receiverPath: receiverPath,
                publicPath: publicPath,
                storagePath: storagePath,
                contractAddress: contractAddress,
                contractName: contractName,
                others: others
            )
        }
    }

    pub fun getRegistry(): {Type: TokenInfo} {
        return self.registry
    }

    init() {
        self.registry = {}
    }
}