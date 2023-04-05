import type { PurchaseEvent } from './events/purchase.interface';
import type { FundingCycleEvent } from './events/funding-cycle.interface';
import type { WithdrawEvent } from './events/withdraw.interface';
import type { DonateEvent } from './events/donate.interface';
import type { DistributeEvent } from './events/distribute.interface';
import type { ProjectCreatedEvent } from './events/project-created.interface';

export type DaoEvent =
	| DistributeEvent
	| PurchaseEvent
	| FundingCycleEvent
	| WithdrawEvent // TODO: Update event type
	| DonateEvent
	| ProjectCreatedEvent;

export type DaoEventName =
	| 'Distribute'
	| 'Purchase'
	| 'Withdraw'
	| 'NewFundingCycle'
	| 'Donate'
	| 'ProjectCreated'
	| 'UpdateThreshold'
	| 'AddSigner';
