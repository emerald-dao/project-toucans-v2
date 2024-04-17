import Crypto
import FungibleToken from "./FungibleToken.cdc"
import OnChainMultiSig from "./OnChainMultiSig.cdc"

access(all) contract FiatToken: FungibleToken {

    // ------- FiatToken Events -------
    // Admin events    
    access(all) event AdminCreated(resourceId: UInt64)
    access(all) event AdminChanged(address: Address, resourceId: UInt64)

    // Owner events
    access(all) event OwnerCreated(resourceId: UInt64)
    access(all) event OwnerChanged(address: Address, resourceId: UInt64)

    // MasterMinter events
    access(all) event MasterMinterCreated(resourceId: UInt64)
    access(all) event MasterMinterChanged(address: Address, resourceId: UInt64)
    
    // Pauser events
    access(all) event Paused()
    access(all) event Unpaused()
    access(all) event PauserCreated(resourceId: UInt64)
    access(all) event PauserChanged(address: Address, resourceId: UInt64)
    
    // Blocklister events
    access(all) event Blocklisted(resourceId: UInt64)
    access(all) event Unblocklisted(resourceId: UInt64)
    access(all) event BlocklisterCreated(resourceId: UInt64)
    access(all) event BlocklisterChanged(address: Address, resourceId: UInt64)
    
    // FiatToken.Vault events
    access(all) event NewVault(resourceId: UInt64)
    access(all) event DestroyVault(resourceId: UInt64)
    access(all) event FiatTokenWithdrawn(amount: UFix64, from: UInt64)
    access(all) event FiatTokenDeposited(amount: UFix64, to: UInt64)

    // Minting events
    access(all) event MinterCreated(resourceId: UInt64)
    access(all) event MinterControllerCreated(resourceId: UInt64)
    access(all) event Mint(minter: UInt64, amount: UFix64)
    access(all) event Burn(minter: UInt64, amount: UFix64)
    access(all) event MinterConfigured(controller: UInt64, minter: UInt64, allowance: UFix64)
    access(all) event MinterRemoved(controller: UInt64, minter: UInt64)
    access(all) event ControllerConfigured(controller: UInt64, minter: UInt64)
    access(all) event ControllerRemoved(controller: UInt64)


    // ------- FungibleToken Events -------
    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)


    // ------- FiatToken Paths -------
    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultBalancePubPath: PublicPath
    access(all) let VaultUUIDPubPath: PublicPath
    access(all) let VaultReceiverPubPath: PublicPath

    access(all) let BlocklistExecutorStoragePath: StoragePath

    access(all) let BlocklisterStoragePath: StoragePath
    access(all) let BlocklisterCapReceiverPubPath: PublicPath
    access(all) let BlocklisterUUIDPubPath: PublicPath
    access(all) let BlocklisterPubSigner: PublicPath

    access(all) let PauseExecutorStoragePath: StoragePath

    access(all) let PauserStoragePath: StoragePath
    access(all) let PauserCapReceiverPubPath: PublicPath
    access(all) let PauserUUIDPubPath: PublicPath
    access(all) let PauserPubSigner: PublicPath

    access(all) let AdminExecutorStoragePath: StoragePath

    access(all) let AdminStoragePath: StoragePath
    access(all) let AdminCapReceiverPubPath: PublicPath
    access(all) let AdminUUIDPubPath: PublicPath
    access(all) let AdminPubSigner: PublicPath

    access(all) let OwnerExecutorStoragePath: StoragePath

    access(all) let OwnerStoragePath: StoragePath
    access(all) let OwnerCapReceiverPubPath: PublicPath
    access(all) let OwnerUUIDPubPath: PublicPath
    access(all) let OwnerPubSigner: PublicPath

    access(all) let MasterMinterExecutorStoragePath: StoragePath

    access(all) let MasterMinterStoragePath: StoragePath
    access(all) let MasterMinterCapReceiverPubPath: PublicPath
    access(all) let MasterMinterUUIDPubPath: PublicPath
    access(all) let MasterMinterPubSigner: PublicPath

    access(all) let MinterControllerStoragePath: StoragePath
    access(all) let MinterControllerUUIDPubPath: PublicPath
    access(all) let MinterControllerPubSigner: PublicPath

    access(all) let MinterStoragePath: StoragePath
    access(all) let MinterUUIDPubPath: PublicPath


    // ------- FiatToken States / Variables -------
    access(all) let name: String
    access(all) var version: String
    // Set to true if the contract is paused
    access(all) var paused: Bool
    // The token total supply
    access(all) var totalSupply: UFix64
    // Blocked resources dictionary {resourceId: Block Height}
    access(contract) let blocklist: {UInt64: UInt64}
    // Managed minters dictionary {MinterController: Minter}
    access(contract) let managedMinters: {UInt64: UInt64}
    // Minter allowance dictionary {Minter: Allowance}
    access(contract) let minterAllowances: { UInt64: UFix64}
    

    // ------- FiatToken Interfaces  -------
    access(all) resource interface ResourceId {
        access(all) fun UUID(): UInt64
    }

    access(all) resource interface AdminCapReceiver {
        access(all) fun setAdminCap(cap: Capability<&AdminExecutor>)
    }

    access(all) resource interface OwnerCapReceiver {
        access(all) fun setOwnerCap(cap: Capability<&OwnerExecutor>)
    }

    access(all) resource interface MasterMinterCapReceiver {
        access(all) fun setMasterMinterCap(cap: Capability<&MasterMinterExecutor>)
    }

    access(all) resource interface BlocklisterCapReceiver {
        access(all) fun setBlocklistCap(cap: Capability<&BlocklistExecutor>)
    }

    access(all) resource interface PauseCapReceiver {
        access(all) fun setPauseCap(cap: Capability<&PauseExecutor>)
    }

    
    // ------- Path linking -------
    access(contract) fun linkAdminExec(_ newPrivPath: PrivatePath): Capability<&AdminExecutor>  {
        return self.account.link<&AdminExecutor>(newPrivPath, target: FiatToken.AdminExecutorStoragePath)
            ?? panic("could not create new AdminExecutor capability link")
    }

    access(contract) fun linkOwnerExec(_ newPrivPath: PrivatePath): Capability<&OwnerExecutor>  {
        return self.account.link<&OwnerExecutor>(newPrivPath, target: FiatToken.OwnerExecutorStoragePath)
            ?? panic("could not create new OwnerExecutor capability link")
    }

    access(contract) fun linkMasterMinterExec(_ newPrivPath: PrivatePath): Capability<&MasterMinterExecutor>  {
        return self.account.link<&MasterMinterExecutor>(newPrivPath, target: FiatToken.MasterMinterExecutorStoragePath)
            ?? panic("could not create new MasterMinterExecutor capability link")
    }

    access(contract) fun linkBlocklistExec(_ newPrivPath: PrivatePath): Capability<&FiatToken.BlocklistExecutor>  {
        return self.account.link<&BlocklistExecutor>(newPrivPath, target: FiatToken.BlocklistExecutorStoragePath)
            ?? panic("could not create new BlocklistExecutor capability link")
    }

    access(contract) fun linkPauserExec(_ newPrivPath: PrivatePath): Capability<&FiatToken.PauseExecutor>  {
        return self.account.link<&FiatToken.PauseExecutor>(newPrivPath, target: FiatToken.PauseExecutorStoragePath)
            ?? panic("could not create new PauseExecutor capability link")
    }

    // ------- Path unlinking -------
    access(contract) fun unlinkPriv(_ privPath: PrivatePath) {
        self.account.unlink(privPath)
    }


    // ------- FiatToken Resources -------
    access(all) resource Vault:
        ResourceId,
        FungibleToken.Provider,
        FungibleToken.Receiver,
        FungibleToken.Balance {
        
        access(all) var balance: UFix64

        access(all) fun withdraw(amount: UFix64): @FungibleToken.Vault {
            pre {
                !FiatToken.paused: "FiatToken contract paused"
                FiatToken.blocklist[self.uuid] == nil: "Vault Blocklisted"
            }
            self.balance = self.balance - amount
            emit FiatTokenWithdrawn(amount: amount, from: self.uuid)
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        access(all) fun deposit(from: @FungibleToken.Vault) {
            pre {
                !FiatToken.paused: "FiatToken contract paused"
                FiatToken.blocklist[from.uuid] == nil: "Receiving Vault Blocklisted"
                FiatToken.blocklist[self.uuid] == nil: "Vault Blocklisted"
            }
            let vault <- from as! @FiatToken.Vault
            self.balance = self.balance + vault.balance
            emit FiatTokenDeposited(amount: vault.balance, to: self.uuid)
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(contract) fun burn() {
            pre {
                self.balance > 0.0: "Cannot burn USDC Vault with zero balance"
            }
            FiatToken.totalSupply = FiatToken.totalSupply - self.balance
            self.balance = 0.0
        }

        destroy() {
            pre {
                self.balance == 0.0: "Cannot destroy USDC Vault with non-zero balance"
            }
            emit DestroyVault(resourceId: self.uuid)
        }

        init(balance: UFix64) {
            self.balance = balance
        }

    }

    access(all) resource AdminExecutor {

        access(self) var currentCapPath: PrivatePath?

        access(all) fun upgradeContract(name: String, code: [UInt8], version: String) {
            FiatToken.upgradeContract(name: name, code: code, version: version)
        }

        access(all) fun changeAdmin(to: Address, newPath: PrivatePath) {
            let newCap = FiatToken.linkAdminExec(newPath)
            let receiver = getAccount(to)
                .getCapability<&Admin{AdminCapReceiver}>(FiatToken.AdminCapReceiverPubPath)
                .borrow() ?? panic("could not borrow AdminCapReceiver capability")
            let idRef = getAccount(to)
                .getCapability<&Admin{ResourceId}>(FiatToken.AdminUUIDPubPath)
                .borrow() ?? panic("could not borrow Admin ResourceId capability")
            receiver.setAdminCap(cap: newCap)
            if self.currentCapPath != nil {
                FiatToken.unlinkPriv(self.currentCapPath!)
            }
            self.currentCapPath = newPath
            emit AdminChanged(address: to, resourceId: idRef.UUID())
        }

        init () {
            self.currentCapPath = nil
        }

    }

    access(all) resource Admin: OnChainMultiSig.PublicSigner, ResourceId, AdminCapReceiver {

        access(self) let multiSigManager: @OnChainMultiSig.Manager
        access(self) var adminExecutorCapability: Capability<&AdminExecutor>?

        access(all) fun setAdminCap(cap: Capability<&AdminExecutor>) {
            pre {
                self.adminExecutorCapability == nil: "Capability has already been set"
                cap.borrow() != nil: "Invalid capability"
            }
            self.adminExecutorCapability = cap
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <-payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "removePayload":
                    let txIndex = p.getArg(i: 0)! as? UInt64 ?? panic ("cannot downcast txIndex")
                    let payloadToRemove <- self.multiSigManager.removePayload(txIndex: txIndex)
                    destroy(payloadToRemove)
                case "upgradeContract":
                    let name = p.getArg(i: 0)! as? String ?? panic ("cannot downcast contract name")
                    let code = p.getArg(i: 1)! as? String ?? panic ("cannot downcast contract code")
                    let version = p.getArg(i: 2)! as? String ?? panic ("cannot downcast contract version")
                    let executor = self.adminExecutorCapability!.borrow() ?? panic("cannot borrow AdminExecutor capability")
                    executor.upgradeContract(name: name, code: code.decodeHex(), version: version)
                case "changeAdmin":
                    let to = p.getArg(i: 0)! as? Address ?? panic("cannot downcast receiver address")
                    let path = p.getArg(i: 1)! as? PrivatePath ?? panic("cannot downcast new link path")
                    let executor = self.adminExecutorCapability!.borrow() ?? panic("cannot borrow AdminExecutor capability")
                    executor.changeAdmin(to: to, newPath: path)
                default:
                    panic("Unknown transaction method")
            }
            destroy (p)
            return nil
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }

        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
            self.adminExecutorCapability = nil
        }

    }

    access(all) resource OwnerExecutor {

        access(self) var ownerCapPath: PrivatePath?
        access(self) var masterMinterCapPath: PrivatePath?
        access(self) var blocklisterCapPath: PrivatePath?
        access(self) var pauserCapPath: PrivatePath?

        access(all) fun reassignOwner(to: Address, newPath: PrivatePath) {
            let newCap = FiatToken.linkOwnerExec(newPath)
            let receiver = getAccount(to)
                .getCapability<&Owner{OwnerCapReceiver}>(FiatToken.OwnerCapReceiverPubPath)
                .borrow() ?? panic("could not borrow the OwnerCapReceiver capability")
            let idRef = getAccount(to)
                .getCapability<&Owner{ResourceId}>(FiatToken.OwnerUUIDPubPath)
                .borrow() ?? panic("could not borrow the Owner ResourceId capability")
            receiver.setOwnerCap(cap: newCap)
            if self.ownerCapPath != nil {
                FiatToken.unlinkPriv(self.ownerCapPath!)
            }
            self.ownerCapPath = newPath
            emit OwnerChanged(address: to, resourceId: idRef.UUID())
        }

        access(all) fun reassignMasterMinter(to: Address, newPath: PrivatePath) {
            let newCap = FiatToken.linkMasterMinterExec(newPath)
            let receiver = getAccount(to)
                .getCapability<&MasterMinter{MasterMinterCapReceiver}>(FiatToken.MasterMinterCapReceiverPubPath)
                .borrow() ?? panic("could not borrow the MasterMinterCapReceiver capability")
            let idRef = getAccount(to)
                .getCapability<&MasterMinter{ResourceId}>(FiatToken.MasterMinterUUIDPubPath)
                .borrow() ?? panic("could not borrow the MasterMinter ResourceId capability")    
            receiver.setMasterMinterCap(cap: newCap)
            if self.masterMinterCapPath != nil {
                FiatToken.unlinkPriv(self.masterMinterCapPath!)
            }
            self.masterMinterCapPath = newPath
            emit MasterMinterChanged(address: to, resourceId: idRef.UUID())
        }

        access(all) fun reassignBlocklister(to: Address, newPath: PrivatePath) {
            let newCap = FiatToken.linkBlocklistExec(newPath)
            let receiver = getAccount(to)
                .getCapability<&Blocklister{BlocklisterCapReceiver}>(FiatToken.BlocklisterCapReceiverPubPath)
                .borrow() ?? panic("could not borrow the BlocklisterCapReceiver capability ")
            let idRef = getAccount(to)
                .getCapability<&Blocklister{ResourceId}>(FiatToken.BlocklisterUUIDPubPath)
                .borrow() ?? panic("could not borrow the Blocklister ResourceId capability")  
            receiver.setBlocklistCap(cap: newCap)
            if self.blocklisterCapPath != nil {
                FiatToken.unlinkPriv(self.blocklisterCapPath!)
            }
            self.blocklisterCapPath = newPath
            emit BlocklisterChanged(address: to, resourceId: idRef.UUID())
        }

        access(all) fun reassignPauser(to: Address, newPath: PrivatePath) {
            let newCap = FiatToken.linkPauserExec(newPath)
            let receiver = getAccount(to)
                .getCapability<&Pauser{PauseCapReceiver}>(FiatToken.PauserCapReceiverPubPath)
                .borrow() ?? panic("could not borrow the PauseCapReceiver capability")
            let idRef = getAccount(to)
                .getCapability<&Pauser{ResourceId}>(FiatToken.PauserUUIDPubPath)
                .borrow() ?? panic("could not borrow the Pauser ResourceId capability") 
            receiver.setPauseCap(cap: newCap)
            if self.pauserCapPath != nil {
                FiatToken.unlinkPriv(self.pauserCapPath!)
            }
            self.pauserCapPath = newPath
            emit PauserChanged(address: to, resourceId: idRef.UUID())
        }

        init() {
            self.ownerCapPath = nil
            self.masterMinterCapPath = nil
            self.blocklisterCapPath = nil
            self.pauserCapPath = nil
        }

    }

    access(all) resource Owner: OnChainMultiSig.PublicSigner, ResourceId, OwnerCapReceiver {

        access(self) let multiSigManager: @OnChainMultiSig.Manager
        access(self) var ownerExecutorCapability: Capability<&OwnerExecutor>?

        access(all) fun setOwnerCap(cap: Capability<&OwnerExecutor>) {
            pre {
                self.ownerExecutorCapability == nil: "Capability has already been set"
                cap.borrow() != nil: "Invalid capability"
            }
            self.ownerExecutorCapability = cap
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <-payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "reassignOwner":
                    let to = p.getArg(i: 0)! as? Address ?? panic("cannot downcast receiver address")
                    let path = p.getArg(i: 1)! as? PrivatePath ?? panic("cannot downcast new link path")
                    let executor = self.ownerExecutorCapability!.borrow() ?? panic("cannot borrow OwnerExecutor capability")
                    executor.reassignOwner(to: to, newPath: path)
                case "reassignMasterMinter":
                    let to = p.getArg(i: 0)! as? Address ?? panic("cannot downcast receiver address")
                    let path = p.getArg(i: 1)! as? PrivatePath ?? panic("cannot downcast new link path")
                    let executor = self.ownerExecutorCapability!.borrow() ?? panic("cannot borrow OwnerExecutor capability")
                    executor.reassignMasterMinter(to: to, newPath: path)
                case "reassignBlocklister":
                    let to = p.getArg(i: 0)! as? Address ?? panic("cannot downcast receiver address")
                    let path = p.getArg(i: 1)! as? PrivatePath ?? panic("cannot downcast new link path")
                    let executor = self.ownerExecutorCapability!.borrow() ?? panic("cannot borrow OwnerExecutor capability")
                    executor.reassignBlocklister(to: to, newPath: path)
                case "reassignPauser":
                    let to = p.getArg(i: 0)! as? Address ?? panic("cannot downcast receiver address")
                    let path = p.getArg(i: 1)! as? PrivatePath ?? panic("cannot downcast new link path")
                    let executor = self.ownerExecutorCapability!.borrow() ?? panic("cannot borrow OwnerExecutor capability")
                    executor.reassignPauser(to: to, newPath: path)
                default:
                    panic("Unknown transaction method")
            }
            destroy (p)
            return nil
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }
        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
            self.ownerExecutorCapability = nil
        }
    }

    access(all) resource MasterMinterExecutor {

        access(all) fun configureMinterController(minter: UInt64, minterController: UInt64) {
            // Overwrite the minter if the MinterController is already configured (a MinterController can only control 1 minter)
            FiatToken.managedMinters.insert(key: minterController, minter)
            emit ControllerConfigured(controller: minterController, minter: minter)
        }

        access(all) fun removeMinterController(minterController: UInt64){
            pre {
                FiatToken.managedMinters.containsKey(minterController): "cannot remove unknown MinterController"
            }
            FiatToken.managedMinters.remove(key: minterController)
            emit ControllerRemoved(controller: minterController)
        }
    }

    access(all) resource MasterMinter: ResourceId, OnChainMultiSig.PublicSigner, MasterMinterCapReceiver {

        access(self) let multiSigManager: @OnChainMultiSig.Manager
        access(self) var masterMinterExecutorCapability: Capability<&MasterMinterExecutor>?

        access(all) fun setMasterMinterCap(cap: Capability<&MasterMinterExecutor>) {
            pre {
                self.masterMinterExecutorCapability == nil: "Capability has already been set"
                cap.borrow() != nil: "Invalid capability"
            }
            self.masterMinterExecutorCapability = cap
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <-payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "configureMinterController":
                    let m = p.getArg(i: 0)! as? UInt64 ?? panic ("cannot downcast minter id")
                    let mc = p.getArg(i: 1)! as? UInt64 ?? panic ("cannot downcast MinterController id")
                    let executor = self.masterMinterExecutorCapability!.borrow() ?? panic("cannot borrow MasterMinterExecutor capability")
                    executor.configureMinterController(minter: m, minterController: mc)
                case "removeMinterController":
                    let mc = p.getArg(i: 0)! as? UInt64 ?? panic ("cannot downcast MinterController id")
                    let executor = self.masterMinterExecutorCapability!.borrow() ?? panic("cannot borrow MasterMinterExecutor capability")
                    executor.removeMinterController(minterController: mc)
                default:
                    panic("Unknown transaction method")
            }
            destroy (p)
            return nil
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }
        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
            self.masterMinterExecutorCapability = nil
        }
    }

    access(all) resource MinterController: ResourceId, OnChainMultiSig.PublicSigner  {

        access(self) let multiSigManager: @OnChainMultiSig.Manager

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun configureMinterAllowance(allowance: UFix64) {
            let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
            FiatToken.minterAllowances[managedMinter] = allowance
            emit MinterConfigured(controller: self.uuid, minter: managedMinter, allowance: allowance)
        }

        access(all) fun increaseMinterAllowance(increment: UFix64) {
            let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
            let allowance = FiatToken.minterAllowances[managedMinter] ?? 0.0
            let newAllowance = allowance.saturatingAdd(increment)
            self.configureMinterAllowance(allowance: newAllowance)
        }

        access(all) fun decreaseMinterAllowance(decrement: UFix64) {
            let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
            let allowance = FiatToken.minterAllowances[managedMinter] ?? panic("Cannot decrease nil MinterAllowance")
            let newAllowance = allowance!.saturatingSubtract(decrement)
            self.configureMinterAllowance(allowance: newAllowance)
        }

        access(all) fun removeMinter() {
            let managedMinter = FiatToken.managedMinters[self.uuid] ?? panic("MinterController does not manage any minters")
            assert(FiatToken.minterAllowances.containsKey(managedMinter), message: "cannot remove unknown Minter")
            FiatToken.minterAllowances.remove(key: managedMinter)
            emit MinterRemoved(controller: self.uuid, minter: managedMinter)
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <-payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "configureMinterAllowance":
                    let allowance = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast allowance amount")
                    self.configureMinterAllowance(allowance: allowance)
                case "increaseMinterAllowance":
                    let increment = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast increment amount")
                    self.increaseMinterAllowance(increment: increment)
                case "decreaseMinterAllowance":
                    let decrement = p.getArg(i: 0)! as? UFix64 ?? panic ("cannot downcast decrement amount")
                    self.decreaseMinterAllowance(decrement: decrement)
                case "removeMinter":
                    self.removeMinter()
                default:
                    panic("Unknown transaction method")
            }
            destroy (p)
            return nil
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }

        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
        }
    }

    access(all) resource Minter: ResourceId {

        access(all) fun mint(amount: UFix64): @FungibleToken.Vault{
            pre {
                !FiatToken.paused: "FiatToken contract paused"
                FiatToken.blocklist[self.uuid] == nil: "Minter Blocklisted"
                FiatToken.minterAllowances.containsKey(self.uuid): "minter does not have allowance set"
            }
            let mintAllowance = FiatToken.minterAllowances[self.uuid]!
            assert(mintAllowance >= amount, message: "insufficient mint allowance")
            FiatToken.minterAllowances.insert(key: self.uuid, mintAllowance - amount)
            let newTotalSupply = FiatToken.totalSupply + amount
            FiatToken.totalSupply = newTotalSupply

            emit Mint(minter: self.uuid, amount: amount)
            return <-create Vault(balance: amount)
        }

        access(all) fun burn(vault: @FungibleToken.Vault) {
            pre {
                !FiatToken.paused: "FiatToken contract paused"
                FiatToken.blocklist[self.uuid] == nil: "Minter Blocklisted"
                FiatToken.minterAllowances.containsKey(self.uuid): "minter is not configured"
            }
            let toBurn <- vault as! @FiatToken.Vault
            let amount = toBurn.balance

            assert(FiatToken.totalSupply >= amount, message: "burning more than total supply")

            // This function updates FiatToken.totalSupply and sets the Vault's value to 0.0
            toBurn.burn()
            // Destroys the now empty Vault
            destroy toBurn
            emit Burn(minter: self.uuid, amount: amount)
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }
    }

    access(all) resource BlocklistExecutor {
        
        access(all) fun blocklist(resourceId: UInt64){
            let block = getCurrentBlock()
            FiatToken.blocklist.insert(key: resourceId, block.height)
            emit Blocklisted(resourceId: resourceId)
        }

        access(all) fun unblocklist(resourceId: UInt64){
            FiatToken.blocklist.remove(key: resourceId)
            emit Unblocklisted(resourceId: resourceId)
        }
    }

    access(all) resource Blocklister: ResourceId, BlocklisterCapReceiver, OnChainMultiSig.PublicSigner {

        access(self) var blocklistCap: Capability<&BlocklistExecutor>?
        access(self) let multiSigManager: @OnChainMultiSig.Manager

        access(all) fun blocklist(resourceId: UInt64){
            post {
                FiatToken.blocklist.containsKey(resourceId): "Resource not blocklisted"
            }
            self.blocklistCap!.borrow()!.blocklist(resourceId: resourceId)
        }

        access(all) fun unblocklist(resourceId: UInt64){
            post {
                !FiatToken.blocklist.containsKey(resourceId): "Resource still on blocklist"
            }
            self.blocklistCap!.borrow()!.unblocklist(resourceId: resourceId)
        }

        access(all) fun setBlocklistCap(cap: Capability<&BlocklistExecutor>){
            pre {
                self.blocklistCap == nil: "Capability has already been set"
                cap.borrow() != nil: "Invalid BlocklistCap capability"
            }
            self.blocklistCap = cap
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <- payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "blocklist":
                    let resourceId = p.getArg(i: 0)! as? UInt64 ?? panic ("cannot downcast resourceId")
                    self.blocklist(resourceId: resourceId)
                case "unblocklist":
                    let resourceId = p.getArg(i: 0)! as? UInt64 ?? panic ("cannot downcast resourceId")
                    self.unblocklist(resourceId: resourceId)
                default:
                    panic("Unknown transaction method")
            }
            destroy(p)
            return nil
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }
        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.blocklistCap = nil
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
        }
    }

    access(all) resource PauseExecutor {

        access(all) fun pause() {
            FiatToken.paused = true
            emit Paused()
        }

        access(all) fun unpause() {
            FiatToken.paused = false
            emit Unpaused()
        }
    }

    access(all) resource Pauser: ResourceId, PauseCapReceiver, OnChainMultiSig.PublicSigner {
        
        access(self) var pauseCap:  Capability<&PauseExecutor>?
        access(self) let multiSigManager: @OnChainMultiSig.Manager

        access(all) fun setPauseCap(cap: Capability<&PauseExecutor>) {
            pre {
                self.pauseCap == nil: "Capability has already been set"
                cap.borrow() != nil: "Invalid PauseCap capability"
            }
            self.pauseCap = cap
        }

        access(all) fun pause(){
            let cap = self.pauseCap!.borrow()!
            cap.pause()
        }

        access(all) fun unpause(){
            let cap = self.pauseCap!.borrow()!
            cap.unpause()
        }

        // ------- OnChainMultiSig.PublicSigner interfaces -------
        access(all) fun addNewPayload(payload: @OnChainMultiSig.PayloadDetails, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addNewPayload(resourceId: self.uuid, payload: <- payload, publicKey: publicKey, sig: sig)
        }

        access(all) fun addPayloadSignature (txIndex: UInt64, publicKey: String, sig: [UInt8]) {
            self.multiSigManager.addPayloadSignature(resourceId: self.uuid, txIndex: txIndex, publicKey: publicKey, sig: sig)
        }

        access(all) fun executeTx(txIndex: UInt64): @AnyResource? {
            let p <- self.multiSigManager.readyForExecution(txIndex: txIndex) ?? panic ("no ready transaction payload at given txIndex")
            switch p.method {
                case "configureKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    let weight = p.getArg(i: 1)! as? UFix64 ?? panic ("cannot downcast weight")
                    let sa = p.getArg(i: 2)! as? UInt8 ?? panic ("cannot downcast sig algo")
                    self.multiSigManager.configureKeys(pks: [pubKey], kws: [weight], sa: [sa])
                case "removeKey":
                    let pubKey = p.getArg(i: 0)! as? String ?? panic ("cannot downcast public key")
                    self.multiSigManager.removeKeys(pks: [pubKey])
                case "pause":
                    self.pause()
                case "unpause":
                    self.unpause()
                default:
                    panic("Unknown transaction method")
            }
            destroy(p)
            return nil
        }

        access(all) fun UUID(): UInt64 {
            return self.uuid
        }

        access(all) fun getTxIndex(): UInt64 {
            return self.multiSigManager.txIndex
        }

        access(all) fun getSignerKeys(): [String] {
            return self.multiSigManager.getSignerKeys()
        }

        access(all) fun getSignerKeyAttr(publicKey: String): OnChainMultiSig.PubKeyAttr? {
            return self.multiSigManager.getSignerKeyAttr(publicKey: publicKey)
        }

        destroy() {
            destroy self.multiSigManager
        }

        init(pk: [String], pka: [OnChainMultiSig.PubKeyAttr]) {
            self.pauseCap = nil
            self.multiSigManager <-  OnChainMultiSig.createMultiSigManager(publicKeys: pk, pubKeyAttrs: pka)
        }
    }

    // ------- FiatToken functions -------
    access(all) fun createEmptyVault(): @Vault {
        let r <-create Vault(balance: 0.0)
        emit NewVault(resourceId: r.uuid)
        return <-r
    }

    access(all) fun createNewAdmin(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @Admin{
        let admin <-create Admin(pk: publicKeys, pka: pubKeyAttrs)
        emit AdminCreated(resourceId: admin.uuid)
        return <- admin
    }

    access(all) fun createNewOwner(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @Owner{
        let owner <-create Owner(pk: publicKeys, pka: pubKeyAttrs)
        emit OwnerCreated(resourceId: owner.uuid)
        return <- owner
    }

    access(all) fun createNewPauser(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @Pauser{
        let pauser <-create Pauser(pk: publicKeys, pka: pubKeyAttrs)
        emit PauserCreated(resourceId: pauser.uuid)
        return <- pauser
    }

    access(all) fun createNewMasterMinter(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @MasterMinter{
        let masterMinter <- create MasterMinter(pk: publicKeys, pka: pubKeyAttrs)
        emit MasterMinterCreated(resourceId: masterMinter.uuid)
        return <- masterMinter
    }

    access(all) fun createNewMinterController(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @MinterController{
        let minterController <- create MinterController(pk: publicKeys, pka: pubKeyAttrs)
        emit MinterControllerCreated(resourceId: minterController.uuid)
        return <- minterController
    }

    access(all) fun createNewMinter(): @Minter{
        let minter <- create Minter()
        emit MinterCreated(resourceId: minter.uuid)
        return <- minter
    }

    access(all) fun createNewBlocklister(publicKeys: [String], pubKeyAttrs: [OnChainMultiSig.PubKeyAttr]): @Blocklister{
        let blocklister <-create Blocklister(pk: publicKeys, pka: pubKeyAttrs)
        emit BlocklisterCreated(resourceId: blocklister.uuid)
        return <-blocklister
    }

    access(all) fun getBlocklist(resourceId: UInt64): UInt64?{
        return FiatToken.blocklist[resourceId]
    }

    access(all) fun getManagedMinter(resourceId: UInt64): UInt64?{
        return FiatToken.managedMinters[resourceId]
    }

    access(all) fun getMinterAllowance(resourceId: UInt64): UFix64?{
        return FiatToken.minterAllowances[resourceId]
    }

    access(self) fun upgradeContract( name: String, code: [UInt8], version: String,) {
        self.account.contracts.update__experimental(name: name, code: code)
        self.version = version
    }

    // ------- FiatToken Initializer -------
    init() {
        // Set the State
        self.name = "USDC"
        self.version = "0.0"
        self.paused = false
        self.totalSupply = 1000.0
        self.blocklist = {}
        self.minterAllowances = {}
        self.managedMinters = {}

        self.VaultStoragePath = /storage/USDCVault
        self.VaultBalancePubPath = /public/USDCVaultBalance
        self.VaultUUIDPubPath = /public/USDCVaultUUID
        self.VaultReceiverPubPath = /public/USDCVaultReceiver

        self.BlocklistExecutorStoragePath = /storage/USDCBlocklistExecutor

        self.BlocklisterStoragePath =  /storage/USDCBlocklist
        self.BlocklisterCapReceiverPubPath = /public/USDCBlocklisterCapReceiver
        self.BlocklisterUUIDPubPath = /public/USDCBlocklisterUUID
        self.BlocklisterPubSigner = /public/USDCBlocklisterSigner

        self.PauseExecutorStoragePath = /storage/p

        self.PauserStoragePath = /storage/p
        self.PauserCapReceiverPubPath = /public/p
        self.PauserUUIDPubPath = /public/p
        self.PauserPubSigner = /public/p

        self.AdminExecutorStoragePath = /storage/p

        self.AdminStoragePath = /storage/p
        self.AdminCapReceiverPubPath = /public/p
        self.AdminUUIDPubPath = /public/p
        self.AdminPubSigner = /public/p

        self.OwnerExecutorStoragePath = /storage/p

        self.OwnerStoragePath = /storage/p
        self.OwnerCapReceiverPubPath = /public/p
        self.OwnerUUIDPubPath = /public/p
        self.OwnerPubSigner = /public/p

        self.MasterMinterExecutorStoragePath = /storage/p

        self.MasterMinterStoragePath = /storage/p
        self.MasterMinterCapReceiverPubPath = /public/p
        self.MasterMinterPubSigner = /public/p
        self.MasterMinterUUIDPubPath = /public/p

        self.MinterControllerStoragePath = /storage/p
        self.MinterControllerUUIDPubPath = /public/p
        self.MinterControllerPubSigner = /public/p

        self.MinterStoragePath = /storage/p
        self.MinterUUIDPubPath = /public/p

        // Create a Vault with the initial totalSupply
        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: self.VaultStoragePath)

        // Create public capabilities to the vault
        self.account.link<&FiatToken.Vault{FungibleToken.Receiver}>(self.VaultReceiverPubPath, target: self.VaultStoragePath)
        self.account.link<&FiatToken.Vault{FungibleToken.Balance}>(self.VaultBalancePubPath, target: self.VaultStoragePath)
        self.account.link<&FiatToken.Vault{FiatToken.ResourceId}>(self.VaultUUIDPubPath, target: self.VaultStoragePath)

        // Emit the TokensInitialized event
        emit TokensInitialized(initialSupply: self.totalSupply)

    }

}
 