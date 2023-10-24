import FungibleToken from "./utility/FungibleToken.cdc"
import ToucansTokens from "./ToucansTokens.cdc"

pub contract ToucansLockTokens {

    pub struct LockedVaultDetails {
        pub let recipient: Address
        pub let vaultType: Type
        pub let unlockTime: UFix64
        pub let tokenInfo: ToucansTokens.TokenInfo
        pub let extra: {String: AnyStruct}

        init(recipient: Address, vaultType: Type, unlockTime: UFix64, tokenInfo: ToucansTokens.TokenInfo) {
            self.recipient = recipient
            self.vaultType = vaultType
            self.unlockTime = unlockTime
            self.tokenInfo = tokenInfo
            self.extra = {}
        }
    }

    pub resource LockedVault {
        pub let details: LockedVaultDetails
        access(contract) var vault: @FungibleToken.Vault?
        // for extra metadata
        access(self) var additions: @{String: AnyResource}

        access(contract) fun withdrawVault(receiver: &{FungibleToken.Receiver}) {
            pre {
                receiver.owner!.address == self.details.recipient: "This LockedVault does not belong to the receiver."
                getCurrentBlock().timestamp >= self.details.unlockTime: "This LockedVault is not ready to be unlocked."
            }
            let vault <- self.vault <- nil
            receiver.deposit(from: <- vault!)
        }

        init(recipient: Address, unlockTime: UFix64, vault: @FungibleToken.Vault, tokenInfo: ToucansTokens.TokenInfo) {
            self.details = LockedVaultDetails(recipient: recipient, vaultType: vault.getType(), unlockTime: unlockTime, tokenInfo: tokenInfo)
            self.vault <- vault
            self.additions <- {}
        }

        destroy() {
            destroy self.vault
            destroy self.additions
        }
    }

    pub resource interface ManagerPublic {
        pub fun claim(lockedVaultUuid: UInt64, receiver: &{FungibleToken.Receiver})
        pub fun getIDs(): [UInt64]
        pub fun getIDsForAddress(address: Address): [UInt64]
        pub fun getLockedVaultInfos(): [LockedVaultDetails]
        pub fun getLockedVaultInfosForAddress(address: Address): [LockedVaultDetails]
    }

    pub resource Manager: ManagerPublic {
        access(self) let lockedVaults: @{UInt64: LockedVault}
        access(self) let addressMap: {Address: [UInt64]}
        // for extra metadata
        access(self) var additions: @{String: AnyResource}

        pub fun deposit(recipient: Address, unlockTime: UFix64, vault: @FungibleToken.Vault, tokenInfo: ToucansTokens.TokenInfo) {
            let lockedVault: @LockedVault <- create LockedVault(recipient: recipient, unlockTime: unlockTime, vault: <- vault, tokenInfo: tokenInfo)
            let recipient: Address = lockedVault.details.recipient
            if self.addressMap[recipient] == nil {
                self.addressMap[recipient] = [lockedVault.uuid]
            } else {
                self.addressMap[recipient]!.append(lockedVault.uuid)
            }

            self.lockedVaults[lockedVault.uuid] <-! lockedVault
        }

        pub fun claim(lockedVaultUuid: UInt64, receiver: &{FungibleToken.Receiver}) {
            let lockedVault: @LockedVault <- self.lockedVaults.remove(key: lockedVaultUuid) ?? panic("This LockedVault does not exist.")
            lockedVault.withdrawVault(receiver: receiver)
            assert(lockedVault.vault == nil, message: "The withdraw did not execute correctly.")
            destroy lockedVault
        }

        pub fun getIDs(): [UInt64] {
            return self.lockedVaults.keys
        }

        pub fun getIDsForAddress(address: Address): [UInt64] {
            return self.addressMap[address] ?? []
        }

        pub fun getLockedVaultInfos(): [LockedVaultDetails] {
            let ids: [UInt64] = self.getIDs()
            let vaults: [LockedVaultDetails] = []
            for id in ids {
                vaults.append(self.lockedVaults[id]?.details!)
            }
            return vaults
        }

        pub fun getLockedVaultInfosForAddress(address: Address): [LockedVaultDetails] {
            let ids: [UInt64] = self.getIDsForAddress(address: address)
            let vaults: [LockedVaultDetails] = []
            for id in ids {
                vaults.append(self.lockedVaults[id]?.details!)
            }
            return vaults
        }

        init() {
            self.lockedVaults <- {}
            self.addressMap = {}
            self.additions <- {}
        }

        destroy() {
            destroy self.lockedVaults
            destroy self.additions
        }
    }

    pub fun createManager(): @Manager {
        return <- create Manager()
    }
}