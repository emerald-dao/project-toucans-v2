import FungibleToken from "./utility/FungibleToken.cdc"
import ToucansTokens from "./ToucansTokens.cdc"

access(all) contract ToucansLockTokens {

    access(all) entitlement ManagerOwner

    access(all) struct LockedVaultDetails {
        access(all) let lockedVaultUuid: UInt64
        access(all) let recipient: Address
        access(all) let vaultType: Type
        access(all) let unlockTime: UFix64
        access(all) let tokenInfo: ToucansTokens.TokenInfo
        access(all) let amount: UFix64
        access(all) let extra: {String: AnyStruct}

        init(
            lockedVaultUuid: UInt64,
            recipient: Address, 
            vaultType: Type, 
            unlockTime: UFix64, 
            tokenInfo: ToucansTokens.TokenInfo, 
            amount: UFix64
        ) {
            self.lockedVaultUuid = lockedVaultUuid
            self.recipient = recipient
            self.vaultType = vaultType
            self.unlockTime = unlockTime
            self.tokenInfo = tokenInfo
            self.amount = amount
            self.extra = {}
        }
    }

    access(all) resource LockedVault {
        access(all) let details: LockedVaultDetails
        access(contract) var vault: @{FungibleToken.Vault}?
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

        init(recipient: Address, unlockTime: UFix64, vault: @{FungibleToken.Vault}, tokenInfo: ToucansTokens.TokenInfo) {
            self.details = LockedVaultDetails(
                lockedVaultUuid: self.uuid,
                recipient: recipient, 
                vaultType: vault.getType(), 
                unlockTime: unlockTime, 
                tokenInfo: tokenInfo, 
                amount: vault.balance
            )
            self.vault <- vault
            self.additions <- {}
        }
    }

    access(all) resource interface ManagerPublic {}

    access(all) resource Manager: ManagerPublic {
        access(self) let lockedVaults: @{UInt64: LockedVault}
        access(self) let addressMap: {Address: [UInt64]}
        // for extra metadata
        access(self) var additions: @{String: AnyResource}

        access(ManagerOwner) fun deposit(recipient: Address, unlockTime: UFix64, vault: @{FungibleToken.Vault}, tokenInfo: ToucansTokens.TokenInfo) {
            pre {
                tokenInfo.tokenType == vault.getType(): "Types are not the same"
            }
            let lockedVault: @LockedVault <- create LockedVault(recipient: recipient, unlockTime: unlockTime, vault: <- vault, tokenInfo: tokenInfo)
            let recipient: Address = lockedVault.details.recipient
            if self.addressMap[recipient] == nil {
                self.addressMap[recipient] = [lockedVault.uuid]
            } else {
                self.addressMap[recipient]!.append(lockedVault.uuid)
            }

            self.lockedVaults[lockedVault.uuid] <-! lockedVault
        }

        access(all) fun claim(lockedVaultUuid: UInt64, receiver: &{FungibleToken.Receiver}) {
            let lockedVault: @LockedVault <- self.lockedVaults.remove(key: lockedVaultUuid) ?? panic("This LockedVault does not exist.")
            lockedVault.withdrawVault(receiver: receiver)
            assert(lockedVault.vault == nil, message: "The withdraw did not execute correctly.")
            destroy lockedVault
            let indexOfUuid: Int = self.addressMap[receiver.owner!.address]!.firstIndex(of: lockedVaultUuid)!
            self.addressMap[receiver.owner!.address]!.remove(at: indexOfUuid)
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.lockedVaults.keys
        }

        access(all) view fun getIDsForAddress(address: Address): [UInt64] {
            return self.addressMap[address] ?? []
        }

        access(all) fun getLockedVaultInfos(): [LockedVaultDetails] {
            let ids: [UInt64] = self.getIDs()
            let vaults: [LockedVaultDetails] = []
            for id in ids {
                vaults.append(self.lockedVaults[id]?.details!)
            }
            return vaults
        }

        access(all) fun getLockedVaultInfosForAddress(address: Address): [LockedVaultDetails] {
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
    }

    access(all) fun createManager(): @Manager {
        return <- create Manager()
    }
}