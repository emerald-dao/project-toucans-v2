import type { PurchaseEvent } from './events/purchase.interface';
import type { FundingCycleEvent } from './events/funding-cycle.interface';
import type { WithdrawEvent } from './events/withdraw.interface';
import type { BatchWithdrawEvent } from './events/batch-withdraw.interface';
import type { DonateEvent } from './events/donate.interface';
import type { MintEvent } from './events/mint.interface';
import type { ProjectCreatedEvent } from './events/project-created.interface';
import type { BatchMintEvent } from './events/batch-mint.interface';

export type DaoEvent =
	| MintEvent
	| BatchMintEvent
	| PurchaseEvent
	| FundingCycleEvent
	| WithdrawEvent // TODO: Update event type
	| BatchWithdrawEvent
	| DonateEvent
	| ProjectCreatedEvent;

export type DaoEventName =
	| 'Mint'
	| 'BatchMint'
	| 'Purchase'
	| 'Withdraw'
	| 'BatchWithdraw'
	| 'NewFundingCycle'
	| 'Donate'
	| 'ProjectCreated'
	| 'UpdateThreshold'
	| 'AddSigner';
