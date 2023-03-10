import Crypto
import FungibleToken from "./utility/FungibleToken.cdc"

pub contract ToucansMultiSign {

    //
    // ------- Resource Interfaces ------- 
    //
    pub resource interface MultiSign {
        access(contract) let multiSignManager: @Manager
    }

    //
    // ------- Action Wrapper ------- 
    //
    pub struct interface Action {
        pub let intent: String
        pub let title: String
        pub fun execute(_ params: {String: AnyStruct})
    }

    //
    // ------- Resources ------- 
    //
    pub resource MultiSignAction {

        access(contract) let action: {Action}
        access(self) let signers: [Address]
        access(self) let votes: {Address: Bool}

        pub fun decline(acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {
            pre {
                self.signers.contains(acctAddress): "This person cannot vote."
            }
            let sign = ToucansMultiSign.verifySignature(uuid: self.uuid, intent: self.action.intent, acctAddress: acctAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)
            if sign {
                self.votes[acctAddress] = false
            }
        }

        pub fun accept(acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {
             pre {
                self.signers.contains(acctAddress): "This person cannot vote."
            }
            let sign = ToucansMultiSign.verifySignature(uuid: self.uuid, intent: self.action.intent, acctAddress: acctAddress, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)
            if sign {
                self.votes[acctAddress] = true
            }
        }

        pub fun getAction(): {Action} {
            return self.action
        }

        pub fun getSigners(): [Address] {
            return self.signers
        }

        // Only returns people who have actually voted
        pub fun getVotes(): {Address: Bool} {
            return self.votes
        }

        pub fun getAccepted(): UInt64 {
            var count: UInt64 = 0
            for voter in self.votes.keys {
                if self.votes[voter]! {
                    count = count + 1
                }
            }
            return count
        }

        pub fun getDeclined(): UInt64 {
            var count: UInt64 = 0
            for voter in self.votes.keys {
                if !self.votes[voter]! {
                    count = count + 1
                }
            }
            return count
        }

        init(_signers: [Address], _action: {Action}) {
            self.signers = _signers
            self.votes = {}
            self.action = _action
        }
    }

    pub resource interface ManagerPublic {
        pub var threshold: UInt64
        pub fun borrowAction(actionUUID: UInt64): &MultiSignAction
        pub fun readyToFinalize(actionUUID: UInt64): Bool
        pub fun getIDs(): [UInt64]
        pub fun getSigners(): [Address]
    }
    
    pub resource Manager: ManagerPublic {
        access(self) let signers: {Address: Bool}
        pub var threshold: UInt64

        // Maps the `uuid` of the MultiSignAction
        // to the resource itself
        access(self) let actions: @{UInt64: MultiSignAction}

        pub fun createMultiSign(action: {Action}) {
            let newAction <- create MultiSignAction(_signers: self.signers.keys, _action: action)
            self.actions[newAction.uuid] <-! newAction
        }

        pub fun readyToFinalize(actionUUID: UInt64): Bool {
            let actionRef: &MultiSignAction = (&self.actions[actionUUID] as &MultiSignAction?)!
            let accepted: Bool = actionRef.getAccepted() >= self.threshold
            let declined: Bool = actionRef.getDeclined() > UInt64(actionRef.getSigners().length) - self.threshold

            return accepted || declined
        }

        // We do not make this public because if anyone else wants to use
        // this contract, they may want specific access control over who can
        // actually execute an action, post conditions, and/or implement requirements
        // (like the treasury must have >= 10 $FLOW before an action can be executed).
        pub fun finalizeAction(actionUUID: UInt64, _ params: {String: AnyStruct}) {
            pre {
                self.readyToFinalize(actionUUID: actionUUID):
                    "This action has not received enough signatures to be accepted or declined yet."
            }
            let action: @MultiSignAction <- self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
            params.insert(key: "uuid", actionUUID)
            params.insert(key: "intent", action.getAction().intent)

            // If it's accepted
            if action.getAccepted() >= self.threshold {
                action.action.execute(params)
            }
            // Will destroy if it's accepted or denied
            destroy action

            self.assertValidTreasury()
        }

        // These will be multisign actions themselves
        access(account) fun addSigner(signer: Address) {
            self.signers.insert(key: signer, true)

            self.assertValidTreasury()
        }

        access(account) fun removeSigner(signer: Address) {
            self.signers.remove(key: signer)

            if Int(self.threshold) > self.signers.length {
                // Automatically reduce the threshold to prevent it from
                // being higher than the number of signers
                self.threshold = UInt64(self.signers.length)
            }

            self.assertValidTreasury()
        }

        access(account) fun updateThreshold(newThreshold: UInt64) {
            self.threshold = newThreshold

            self.assertValidTreasury()
        }

        pub fun borrowAction(actionUUID: UInt64): &MultiSignAction {
            return (&self.actions[actionUUID] as &MultiSignAction?)!
        }

        pub fun getIDs(): [UInt64] {
            return self.actions.keys
        }

        pub fun getSigners(): [Address] {
            return self.signers.keys
        }

        access(self) fun assertValidTreasury() {
            assert(self.threshold > 0, message: "Threshold must be greater than 0.")
            assert(self.signers.length > 0, message: "Number of signers must be greater than 0.")
            assert(self.signers.length >= Int(self.threshold), message: "Number of signers must be greater than or equal to the threshold.")
        }

        init(_initialSigners: [Address], _initialThreshold: UInt64) {
            self.signers = {}
            self.actions <- {}
            self.threshold = _initialThreshold

            for signer in _initialSigners {
                self.signers.insert(key: signer, true)
            }

            self.assertValidTreasury()
        }

        destroy() {
            destroy self.actions
        }
    }

    // 
    // ------- Functions --------
    //
        
    pub fun createMultiSigManager(signers: [Address], threshold: UInt64): @Manager {
        return <- create Manager(_initialSigners: signers, _initialThreshold: threshold)
    }

    // ZayVerifierv2 - verifySignature
    //
    // Explanation: 
    // Verifies that `acctAddress` is the one that signed the `message` (producing `signatures`) 
    // with the `keyIds` (that are hopefully in its account, or its false) during `signatureBlock`
    //
    // Parameters:
    // acctAddress: the address of the account we're verifying
    // message: {blockId}{uuid of this resource}
    // keyIds: the keyIds that the acctAddress theoretically signed with
    // signatures: the signature that was theoretically produced from the `acctAddress` signing `message` with `keyIds`.
    // can be multiple because you can sign with multiple keys, thus creating multiple signatures.
    // signatureBlock: when the signature was produced
    //
    // Returns:
    // Whether or not this signature is valid
    pub fun verifySignature(uuid: UInt64, intent: String, acctAddress: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64): Bool {
        let keyList = Crypto.KeyList()
        let account = getAccount(acctAddress)

        let publicKeys: [[UInt8]] = []
        let weights: [UFix64] = []
        let signAlgos: [UInt] = []
        
        let uniqueKeys: {Int: Bool} = {}
        for id in keyIds {
            uniqueKeys[id] = true
        }
        assert(uniqueKeys.keys.length == keyIds.length, message: "Invalid duplicates of the same keyID provided for signature")

        var counter = 0
        var totalWeight = 0.0
        while (counter < keyIds.length) {
            let accountKey: AccountKey = account.keys.get(keyIndex: keyIds[counter]) ?? panic("Provided key signature does not exist")
            
            publicKeys.append(accountKey.publicKey.publicKey)
            let keyWeight = accountKey.weight
            weights.append(keyWeight)
            totalWeight = totalWeight + keyWeight

            signAlgos.append(UInt(accountKey.publicKey.signatureAlgorithm.rawValue))

            counter = counter + 1
        }

        // Why 999 instead of 1000? Blocto currently signs with a 999 weight key sometimes for non-custodial blocto accounts.
        // We would like to support these non-custodial Blocto wallets - but can be switched to 1000 weight when Blocto updates this.
        assert(totalWeight >= 999.0, message: "Total weight of combined signatures did not satisfy 999 requirement.")

        var i = 0
        for publicKey in publicKeys {
            keyList.add(
                PublicKey(
                    publicKey: publicKey,
                    signatureAlgorithm: signAlgos[i] == 2 ? SignatureAlgorithm.ECDSA_secp256k1  : SignatureAlgorithm.ECDSA_P256
                ),
                hashAlgorithm: HashAlgorithm.SHA3_256,
                weight: weights[i]
            )
            i = i + 1
        }

        // In verify we need a [KeyListSignature] so we do that here
        let signatureSet: [Crypto.KeyListSignature] = []
        var j = 0
        for signature in signatures {
            signatureSet.append(
                Crypto.KeyListSignature(
                    keyIndex: keyIds[j],
                    signature: signature.decodeHex()
                )
            )
            j = j + 1
        }

        counter = 0
        let signingBlock = getBlock(at: signatureBlock)!
        let blockId = signingBlock.id
        let blockIds: [UInt8] = []
        while (counter < blockId.length) {
            blockIds.append(blockId[counter])
            counter = counter + 1
        }
        
        // message: {uuid of this resource}{intent}{blockId}
        let uuidString = uuid.toString()
        let intentHex = String.encodeHex(intent.utf8)
        let blockIdHexStr: String = String.encodeHex(blockIds)

        // Matches the `uuid` of this resource
        assert(
            uuidString == message.slice(from: 0, upTo: uuidString.length), 
            message: "This signature is not for this action"
        )
        // Matches the `intent` of this resource
        assert(
            intentHex == message.slice(from: uuidString.length, upTo: uuidString.length + intentHex.length), 
            message: "Failed to validate intent"
        )
        // Ensure that the message passed in is of the current block id...
        assert(
            blockIdHexStr == message.slice(from: uuidString.length + intentHex.length, upTo: message.length), 
            message: "Unable to validate signature provided contained a valid block id."
        )

        let signatureValid = keyList.verify(
            signatureSet: signatureSet,
            signedData: message.decodeHex()
        )
        return signatureValid
    }
}