import Crypto
import FungibleToken from "./utility/FungibleToken.cdc"
import NFTCatalog from "./utility/NFTCatalog.cdc"
import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import FIND from "./utility/FIND.cdc"

pub contract ToucansUtils {
  pub fun ownsNFTFromCatalogCollectionIdentifier(collectionIdentifier: String, user: Address): Bool {
    if let entry: NFTCatalog.NFTCatalogMetadata = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) {
        let publicPath: PublicPath = entry.collectionData.publicPath
        if let collection: &{NonFungibleToken.CollectionPublic} = getAccount(user).getCapability(publicPath).borrow<&{NonFungibleToken.CollectionPublic}>() {
            let identifier: String = collection.getType().identifier
            let contractAddressToString: String = entry.contractAddress.toString()
            let constructedIdentifier: String = "A.".concat(contractAddressToString.slice(from: 2, upTo: contractAddressToString.length)).concat(".").concat(entry.contractName).concat(".Collection")
            if identifier == constructedIdentifier && collection.getIDs().length > 0 {
                return true
            }
        }
    }
    
    return false
  }

  pub fun depositTokensToAccount(funds: @FungibleToken.Vault, to: Address, publicPath: PublicPath) {
    let vault = getAccount(to).getCapability(publicPath).borrow<&{FungibleToken.Receiver}>() 
              ?? panic("Account does not have a proper Vault set up.")
    vault.deposit(from: <- funds)
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

  pub fun rangeFunc(_ start: Int, _ end: Int, _ f : ((Int):Void) ) {
    var current = start
    while current < end{
        f(current)
        current = current + 1
    }
  } 

  pub fun range(_ start: Int, _ end: Int): [Int]{
    var res:[Int] = []
    self.rangeFunc(start, end, fun (i:Int){
        res.append(i)
    })
    return res
  }

  pub fun index(_ s : String, _ substr : String, _ startIndex: Int): Int?{
    for i in self.range(startIndex,s.length-substr.length+1){
        if s[i]==substr[0] && s.slice(from:i, upTo:i+substr.length) == substr{
            return i
        }
    }
    return nil
  }

  pub fun getFind(_ address: Address): String {
    if let name = FIND.reverseLookup(address) {
      return name.concat(".find")
    }
    return address.toString()
  }

  pub fun fixToReadableString(num: UFix64): String {
    let numToString: String = num.toString()
    let indexOfDot: Int = ToucansUtils.index(numToString, ".", 1)!
    return numToString.slice(from: 0, upTo: indexOfDot + 3)
  }
}