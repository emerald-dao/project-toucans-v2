import type { PurchaseEvent } from './events/purchase.interface';
import type { FundingCycleEvent } from './events/funding-cycle.interface';
import type { WithdrawEvent } from './events/withdraw.interface';
import type { BatchWithdrawEvent } from './events/batch-withdraw.interface';
import type { DonateEvent } from './events/donate.interface';
import type { DonateNFTsEvent } from './events/donateNFTs.interface';
import type { MintEvent } from './events/mint.interface';
import type { BurnEvent } from './events/burn.interface';
import type { ProjectCreatedEvent } from './events/project-created.interface';
import type { BatchMintEvent } from './events/batch-mint.interface';
import type { LockTokensEvent } from './events/lock-tokens.interface';
import type { WithdrawNFTsEvent } from './events/withdrawNFTs.interface';

export type DaoEvent =
	| MintEvent
	| BatchMintEvent
	| BurnEvent
	| PurchaseEvent
	| FundingCycleEvent
	| WithdrawEvent // TODO: Update event type
	| BatchWithdrawEvent
	| DonateEvent
	| ProjectCreatedEvent
	| LockTokensEvent
	| DonateNFTsEvent
	| WithdrawNFTsEvent;

export type DaoEventName =
	| 'Mint'
	| 'BatchMint'
	| 'Burn'
	| 'Purchase'
	| 'Withdraw'
	| 'BatchWithdraw'
	| 'NewFundingCycle'
	| 'Donate'
	| 'ProjectCreated'
	| 'UpdateThreshold'
	| 'AddSigner'
	| 'DonateNFT'
	| 'WithdrawNFTs'
	| 'LockTokens';
