import FungibleToken from "./utility/FungibleToken.cdc"
import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import ToucansUtils from "./ToucansUtils.cdc"
import NFTCatalog from "./utility/NFTCatalog.cdc"

access(all) contract ToucansActions {

  access(all) struct interface Action {
    access(all) fun getIntent(): String
    access(all) fun getTitle(): String
  }


  //                _   _                 
  //      /\       | | (_)                
  //     /  \   ___| |_ _  ___  _ __  ___ 
  //    / /\ \ / __| __| |/ _ \| '_ \/ __|
  //   / ____ \ (__| |_| | (_) | | | \__ \
  //  /_/    \_\___|\__|_|\___/|_| |_|___/   


  // Transfers `amount` tokens from the treasury to `recipientVault`
  access(all) struct WithdrawToken: Action {
    access(all) let vaultType: Type
    access(all) let recipientVault: Capability<&{FungibleToken.Receiver}>
    access(all) let amount: UFix64
    access(all) let tokenSymbol: String
    access(all) let readableAmount: String

    access(all) fun getIntent(): String {
      return "Withdraw ".concat(self.readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens from the treasury to ").concat(ToucansUtils.getFind(self.recipientVault.borrow()!.owner!.address))
    }

    access(all) fun getTitle(): String {
      return "Withdraw"
    }

    init(_ vaultType: Type, _ recipientVault: Capability<&{FungibleToken.Receiver}>, _ amount: UFix64, _ tokenSymbol: String) {
      pre {
        recipientVault.check(): "Invalid recipient capability."
      }
      self.vaultType = vaultType
      self.recipientVault = recipientVault
      self.amount = amount
      self.tokenSymbol = tokenSymbol
      self.readableAmount = ToucansUtils.fixToReadableString(num: amount)
    }
  }

  access(all) struct BatchWithdrawToken: Action {
    access(all) let vaultType: Type
    access(all) let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}
    access(all) let amounts: {Address: UFix64}
    access(all) let tokenSymbol: String
    access(all) let totalReadableAmount: String

    access(all) fun getIntent(): String {
      return "Withdraw a total of ".concat(self.totalReadableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens from the treasury to ").concat(self.amounts.keys.length.toString()).concat(" total wallets")
    }

    access(all) fun getTitle(): String {
      return "BatchWithdraw"
    }

    init(_ vaultType: Type, _ recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}, _ amounts: {Address: UFix64}, _ tokenSymbol: String) {
      self.vaultType = vaultType
      self.recipientVaults = recipientVaults
      self.amounts = amounts
      self.tokenSymbol = tokenSymbol

      var totalAmount: UFix64 = 0.0
      for amount in amounts.values {
        totalAmount = totalAmount + amount
      }
      self.totalReadableAmount = ToucansUtils.fixToReadableString(num: totalAmount)
    }
  }

  // Withdraws NFTs from the treasury to 1 address
  access(all) struct WithdrawNFTs: Action {
    access(all) let collectionType: Type
    access(all) let recipientCollection: Capability<&{NonFungibleToken.Receiver}>
    access(all) let nftIDs: [UInt64]
    access(all) let collectionIdentifier: String
    access(all) let collectionName: String
    access(all) let collectionExternalURL: String
    access(all) let extra: {String: AnyStruct}

    access(all) fun getIntent(): String {
      return "Withdraw ".concat(self.nftIDs.length.toString()).concat(" ").concat(self.collectionName).concat(" NFT(s) from the treasury to ").concat(ToucansUtils.getFind(self.recipientCollection.address))
    }

    access(all) fun getTitle(): String {
      return "WithdrawNFTs"
    }

    init(_ collectionType: Type, _ nftIDs: [UInt64], _ recipientCollection: Capability<&{NonFungibleToken.Receiver}>, _ recipientCollectionBackup: Capability<&{NonFungibleToken.CollectionPublic}>, _ message: String) {
      pre {
        recipientCollection.check() || recipientCollectionBackup.check(): "Invalid recipient capability."
      }
      self.collectionType = collectionType
      self.recipientCollection = recipientCollection
      self.nftIDs = nftIDs
      let nftCatalogCollectionIdentifier = ToucansUtils.getNFTCatalogCollectionIdentifierFromCollectionIdentifier(collectionIdentifier: collectionType.identifier)
      let nftCatalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier: nftCatalogCollectionIdentifier)!
      self.collectionIdentifier = nftCatalogCollectionIdentifier
      self.collectionName = nftCatalogEntry.collectionDisplay.name
      self.collectionExternalURL = nftCatalogEntry.collectionDisplay.externalURL.url
      self.extra = {
        "backupReceiver": recipientCollectionBackup,
        "message": message
      }
    }
  }

  // Mint `amount` tokens to `recipientVault`
  access(all) struct MintTokens: Action {
    access(all) let recipientVault: Capability<&{FungibleToken.Receiver}>
    access(all) let amount: UFix64
    access(all) let tokenSymbol: String
    access(all) let readableAmount: String

    access(all) fun getIntent(): String {
      return "Mint ".concat(self.readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens to ").concat(ToucansUtils.getFind(self.recipientVault.borrow()!.owner!.address))
    }

    access(all) fun getTitle(): String {
      return "Mint"
    }

    init(_ recipientVault: Capability<&{FungibleToken.Receiver}>, _ amount: UFix64, _ tokenSymbol: String) {
      self.recipientVault = recipientVault
      assert(self.recipientVault.check(), message: "Invalid recipient capability.")
      self.amount = amount
      self.tokenSymbol = tokenSymbol
      self.readableAmount = ToucansUtils.fixToReadableString(num: amount)
    }
  }

  access(all) struct BatchMintTokens: Action {
    access(all) let recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}
    access(all) let amounts: {Address: UFix64}
    access(all) let tokenSymbol: String
    access(all) let totalReadableAmount: String

    access(all) fun getIntent(): String {
      return "Mint a total of ".concat(self.totalReadableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens to ").concat(self.amounts.keys.length.toString()).concat(" total wallets")
    }

    access(all) fun getTitle(): String {
      return "BatchMint"
    }

    init(_ recipientVaults: {Address: Capability<&{FungibleToken.Receiver}>}, _ amounts: {Address: UFix64}, _ tokenSymbol: String) {
      self.recipientVaults = recipientVaults
      self.amounts = amounts
      self.tokenSymbol = tokenSymbol

      var totalAmount: UFix64 = 0.0
      for amount in amounts.values {
        totalAmount = totalAmount + amount
      }
      self.totalReadableAmount = ToucansUtils.fixToReadableString(num: totalAmount)
    }
  }

  // Mint `amount` tokens to the treasury directly
  access(all) struct MintTokensToTreasury: Action {
    access(all) let amount: UFix64
    access(all) let tokenSymbol: String
    access(all) let readableAmount: String

    access(all) fun getIntent(): String {
      return "Mint ".concat(self.readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens to the Treasury")
    }

    access(all) fun getTitle(): String {
      return "MintToTreasury"
    }

    init(_ amount: UFix64, _ tokenSymbol: String) {
      self.amount = amount
      self.tokenSymbol = tokenSymbol
      self.readableAmount = ToucansUtils.fixToReadableString(num: amount)
    }
  }

  // Add a new signer to the treasury
  access(all) struct AddOneSigner: Action {
    access(all) let signer: Address

    access(all) fun getIntent(): String {
      return "Add ".concat(ToucansUtils.getFind(self.signer)).concat(" as a signer to the Treasury")
    }

    access(all) fun getTitle(): String {
      return "AddSigner"
    }

    init(_ signer: Address) {
      self.signer = signer
    }
  }

  // Remove a signer from the treasury
  // NOTE: If this reduces the # of signers to 
  // below the threshold, this will automatically
  // reduce the threshold to the # of signers
  access(all) struct RemoveOneSigner: Action {
    access(all) let signer: Address

    access(all) fun getIntent(): String {
      return "Remove ".concat(ToucansUtils.getFind(self.signer)).concat(" as a signer from the Treasury")
    }

    access(all) fun getTitle(): String {
      return "RemoveSigner"
    }

    init(_ signer: Address) {
      self.signer = signer
    }
  }

  // Update the threshold of signers
  access(all) struct UpdateTreasuryThreshold: Action {
    access(all) let threshold: UInt64

    access(all) fun getIntent(): String {
      return "Update the threshold of signers needed to execute an action in the Treasury to ".concat(self.threshold.toString())
    }

    access(all) fun getTitle(): String {
      return "UpdateThreshold"
    }

    init(_ threshold: UInt64) {
      self.threshold = threshold
    }
  }

  // burn your DAOs token from the treasury
  access(all) struct BurnTokens: Action {
    access(all) let amount: UFix64
    access(all) let tokenSymbol: String
    access(all) let readableAmount: String

    access(all) fun getIntent(): String {
      return "Burn ".concat(self.readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens from the Treasury")
    }

    access(all) fun getTitle(): String {
      return "Burn"
    }

    init(_ amount: UFix64, _ tokenSymbol: String) {
      self.amount = amount
      self.tokenSymbol = tokenSymbol
      self.readableAmount = ToucansUtils.fixToReadableString(num: amount)
    }
  }

  // lock a token to a user
  access(all) struct LockTokens: Action {
    access(all) let recipient: Address
    access(all) let amount: UFix64
    access(all) let tokenSymbol: String
    access(all) let readableAmount: String
    access(all) let unlockTime: UFix64

    access(all) fun getIntent(): String {
      return "Lock ".concat(self.readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens for ").concat(ToucansUtils.getFind(self.recipient)).concat(" until ").concat(self.unlockTime.toString())
    }

    access(all) fun getTitle(): String {
      return "LockTokens"
    }

    init(_ recipient: Address, _ amount: UFix64, _ tokenSymbol: String, _ unlockTime: UFix64) {
      self.amount = amount
      self.tokenSymbol = tokenSymbol
      self.readableAmount = ToucansUtils.fixToReadableString(num: amount)
      self.unlockTime = unlockTime
      self.recipient = recipient
    }
  }

  // stake flow by swapping it to stFlow on increment fi
  access(all) struct StakeFlow: Action {
    access(all) let flowAmount: UFix64
    access(all) let readableAmount: String
    access(all) let stFlowAmountOutMin: UFix64
    access(all) let readableMin: String

    access(all) fun getIntent(): String {
      return "Stake ".concat(self.readableAmount).concat(" FLOW ").concat(" tokens by swapping them for a minimum of ").concat(self.readableMin).concat(" stFlow.")
    }

    access(all) fun getTitle(): String {
      return "StakeFlow"
    }

    init(_ flowAmount: UFix64, _ stFlowAmountOutMin: UFix64) {
      self.flowAmount = flowAmount
      self.readableAmount = ToucansUtils.fixToReadableString(num: flowAmount)
      self.stFlowAmountOutMin = stFlowAmountOutMin
      self.readableMin = ToucansUtils.fixToReadableString(num: stFlowAmountOutMin)
    }
  }

  // unstake flow by swapping stFlow for flow on increment fi
  access(all) struct UnstakeFlow: Action {
    access(all) let stFlowAmount: UFix64
    access(all) let readableAmount: String
    access(all) let flowAmountOutMin: UFix64
    access(all) let readableMin: String

    access(all) fun getIntent(): String {
      return "Unstake FLOW".concat(" tokens by swapping ").concat(self.readableAmount).concat(" stFlow for a minimum of ").concat(self.readableMin).concat(" FLOW.")
    }

    access(all) fun getTitle(): String {
      return "UnstakeFlow"
    }

    init(_ stFlowAmount: UFix64, _ flowAmountOutMin: UFix64) {
      self.stFlowAmount = stFlowAmount
      self.readableAmount = ToucansUtils.fixToReadableString(num: stFlowAmount)
      self.flowAmountOutMin = flowAmountOutMin
      self.readableMin = ToucansUtils.fixToReadableString(num: flowAmountOutMin)
    }
  }
}
 