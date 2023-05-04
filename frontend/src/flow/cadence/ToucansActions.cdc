import FungibleToken from "./utility/FungibleToken.cdc"
import ToucansUtils from "./ToucansUtils.cdc"

pub contract ToucansActions {

  pub struct interface Action {
    pub fun getIntent(): String
    pub fun getTitle(): String
  }


  //                _   _                 
  //      /\       | | (_)                
  //     /  \   ___| |_ _  ___  _ __  ___ 
  //    / /\ \ / __| __| |/ _ \| '_ \/ __|
  //   / ____ \ (__| |_| | (_) | | | \__ \
  //  /_/    \_\___|\__|_|\___/|_| |_|___/   


  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct WithdrawToken: Action {
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64
    pub let tokenSymbol: String

    pub fun getIntent(): String {
      let amountToString: String = self.amount.toString()
      let indexOfDot: Int = ToucansUtils.index(amountToString, ".", 1)!
      let readableAmount: String = amountToString.slice(from: 0, upTo: indexOfDot + 3)
      return "Withdraw ".concat(readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens from the treasury to ").concat(ToucansUtils.getFind(self.recipientVault.borrow()!.owner!.address))
    }

    pub fun getTitle(): String {
      return "Withdraw"
    }

    init(_ recipientVault: Capability<&{FungibleToken.Receiver}>, _ amount: UFix64, tokenSymbol: String) {
      self.recipientVault = recipientVault
      assert(self.recipientVault.check(), message: "Invalid recipient capability.")
      self.amount = amount
      self.tokenSymbol = tokenSymbol
    }
  }

  // Mint `amount` tokens to `recipientVault`
  pub struct MintTokens: Action {
    pub let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64
    pub let tokenSymbol: String

    pub fun getIntent(): String {
      let amountToString: String = self.amount.toString()
      let indexOfDot: Int = ToucansUtils.index(amountToString, ".", 1)!
      let readableAmount: String = amountToString.slice(from: 0, upTo: indexOfDot + 3)
      return "Mint ".concat(readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens to ").concat(ToucansUtils.getFind(self.recipientVault.borrow()!.owner!.address))
    }

    pub fun getTitle(): String {
      return "Mint"
    }

    init(_ recipientVault: Capability<&{FungibleToken.Receiver}>, _ amount: UFix64, tokenSymbol: String) {
      self.recipientVault = recipientVault
      assert(self.recipientVault.check(), message: "Invalid recipient capability.")
      self.amount = amount
      self.tokenSymbol = tokenSymbol
    }
  }

  // Mint `amount` tokens to the treasury directly
  pub struct MintTokensToTreasury: Action {
    pub let amount: UFix64
    pub let tokenSymbol: String

    pub fun getIntent(): String {
      let amountToString: String = self.amount.toString()
      let indexOfDot: Int = ToucansUtils.index(amountToString, ".", 1)!
      let readableAmount: String = amountToString.slice(from: 0, upTo: indexOfDot + 3)
      return "Mint ".concat(readableAmount).concat(" ").concat(self.tokenSymbol).concat(" tokens to the treasury.")
    }

    pub fun getTitle(): String {
      return "MintToTreasury"
    }

    init(_ amount: UFix64, tokenSymbol: String) {
      self.amount = amount
      self.tokenSymbol = tokenSymbol
    }
  }

  // Add a new signer to the treasury
  pub struct AddOneSigner: Action {
    pub let signer: Address

    pub fun getIntent(): String {
      return "Add ".concat(ToucansUtils.getFind(self.signer)).concat(" as a signer to the Treasury.")
    }

    pub fun getTitle(): String {
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
  pub struct RemoveOneSigner: Action {
    pub let signer: Address

    pub fun getIntent(): String {
      return "Remove ".concat(ToucansUtils.getFind(self.signer)).concat(" as a signer from the Treasury.")
    }

    pub fun getTitle(): String {
      return "RemoveSigner"
    }

    init(_ signer: Address) {
      self.signer = signer
    }
  }

  // Update the threshold of signers
  pub struct UpdateTreasuryThreshold: Action {
    pub let threshold: UInt64

    pub fun getIntent(): String {
      return "Update the threshold of signers needed to execute an action in the Treasury to ".concat(self.threshold.toString())
    }

    pub fun getTitle(): String {
      return "UpdateThreshold"
    }

    init(_ threshold: UInt64) {
      self.threshold = threshold
    }
  }
}
 