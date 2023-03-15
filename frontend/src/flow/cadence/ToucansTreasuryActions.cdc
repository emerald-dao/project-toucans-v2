import ToucansMultiSign from "./ToucansMultiSign.cdc"
import FungibleToken from "./utility/FungibleToken.cdc"
import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import Toucans from "./Toucans.cdc"

pub contract ToucansTreasuryActions {

  pub event AddSigner(projectId: String, signer: Address)
  pub event RemoveSigner(projectId: String, signer: Address)
  pub event UpdateThreshold(projectId: String, newThreshold: UInt64)

  // Transfers `amount` tokens from the treasury to `recipientVault`
  pub struct WithdrawToken: ToucansMultiSign.Action {
    pub let intent: String
    pub let title: String
    access(self) let recipientVault: Capability<&{FungibleToken.Receiver}>
    pub let amount: UFix64

    pub fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &Toucans.Project = params["treasury"]! as! &Toucans.Project
      let vault: &{FungibleToken.Receiver} = self.recipientVault.borrow() ?? panic("Invalid recipient capability.")

      treasuryRef.withdrawFromTreasury(vault: vault, amount: self.amount)
    }

    init(_recipientVault: Capability<&{FungibleToken.Receiver}>, _amount: UFix64) {
      pre {
        _recipientVault.check(): "Invalid recipient capability."
      }
      self.intent = "Withdraw "
                        .concat(_amount.toString())
                        .concat(" ")
                        .concat(_recipientVault.getType().identifier)
                        .concat(" tokens from the treasury to ")
                        .concat((_recipientVault.borrow()!.owner!.address as Address).toString())
      self.title = "Withdraw"
      self.recipientVault = _recipientVault
      self.amount = _amount
    }
  }

  // Add a new signer to the treasury
  pub struct AddOneSigner: ToucansMultiSign.Action {
    pub let signer: Address
    pub let intent: String
    pub let title: String

    pub fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &Toucans.Project = params["treasury"]! as! &Toucans.Project

      let manager = treasuryRef.borrowManager()
      manager.addSigner(signer: self.signer)

      let uuid = params["uuid"]! as! UInt64
      let intent = params["intent"]! as! String
      let message = params["message"]! as! String
      let keyIds = params["keyIds"]! as! [Int]
      let signatures = params["signatures"]! as! [String]
      let signatureBlock = params["signatureBlock"]! as! UInt64
      let validSig = ToucansMultiSign.verifySignature(uuid: uuid, intent: intent, acctAddress: self.signer, message: message, keyIds: keyIds, signatures: signatures, signatureBlock: signatureBlock)
      assert(validSig, message: "The signer that will be added must have signed the request to be added.")

      emit AddSigner(projectId: treasuryRef.projectId, signer: self.signer)
    }

    init(_signer: Address) {
      self.signer = _signer
      self.title = "AddSigner"
      self.intent = "Add ".concat((_signer as Address).toString()).concat(" as a signer to the Treasury.")
    }
  }

  // Remove a signer from the treasury
  // NOTE: If this reduces the # of signers to 
  // below the threshold, this will automatically
  // reduce the threshold to the # of signers
  pub struct RemoveOneSigner: ToucansMultiSign.Action {
    pub let signer: Address
    pub let intent: String
    pub let title: String

    pub fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &Toucans.Project = params["treasury"]! as! &Toucans.Project

      let manager = treasuryRef.borrowManager()
      manager.removeSigner(signer: self.signer)

      emit RemoveSigner(projectId: treasuryRef.projectId, signer: self.signer)
    }

    init(_signer: Address) {
      self.signer = _signer
      self.title = "RemoveSigner"
      self.intent = "Remove ".concat((_signer as Address).toString()).concat(" as a signer to the Treasury.")
    }
  }

  // Update the threshold of signers
  pub struct UpdateTreasuryThreshold: ToucansMultiSign.Action {
    pub let threshold: UInt64
    pub let intent: String
    pub let title: String

    pub fun execute(_ params: {String: AnyStruct}) {
      let treasuryRef: &Toucans.Project = params["treasury"]! as! &Toucans.Project

      let manager = treasuryRef.borrowManager()
      assert(manager.getSigners().length >= Int(self.threshold), message: "You cannot assign a new threshold higher than the current number of signers.")
      manager.updateThreshold(newThreshold: self.threshold)

      emit UpdateThreshold(projectId: treasuryRef.projectId, newThreshold: self.threshold)
    }

    init(_threshold: UInt64) {
      self.threshold = _threshold
      self.title = "UpdateThreshold"
      self.intent = "Update the threshold of signers needed to execute an action in the Treasury to ".concat(_threshold.toString())
    }
  }

  pub struct Test: ToucansMultiSign.Action {
    pub let intent: String
    pub let title: String
    access(self) let cap: Capability<&FungibleToken.Vault>

    pub fun execute(_ params: {String: AnyStruct}) {
      let tokens <- self.cap.borrow()!.withdraw(amount: 10.0)
      destroy tokens
    }

    init(_cap: Capability<&FungibleToken.Vault>) {
      pre {
        _cap.check(): "check"
      }
      self.intent = "Testing"
      self.title = "Test"
      self.cap = _cap
    }
  }

  pub fun cantExecuteAutomatically(): [Type] {
    return [
      AddSigner.getType()
    ]
  }
}
 