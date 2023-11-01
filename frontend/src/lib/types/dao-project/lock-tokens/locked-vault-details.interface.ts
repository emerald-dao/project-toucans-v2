import type { TokenInfo } from "../dao-project.interface";

export interface LockedVaultDetails {
    lockedVaultUuid: string;
    recipient: string;
    unlockTime: string; // in unix seconds
    tokenInfo: TokenInfo
    amount: string;
}
