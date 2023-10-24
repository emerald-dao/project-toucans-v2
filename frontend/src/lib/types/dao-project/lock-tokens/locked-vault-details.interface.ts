import type { TokenInfo } from "../dao-project.interface";

export interface LockedVaultDetails {
    recipient: string;
    unlockTime: string; // in unix seconds
    tokenInfo: TokenInfo
}
