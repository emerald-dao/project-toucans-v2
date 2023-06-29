<script type="ts">
	import Icon from '@iconify/svelte';
	import { formatDate } from '$lib/utilities/formatDate';
	import { Currency, Modal, getModal } from '@emerald-dao/component-library';
	import type { DaoEvent, DaoEventName } from '$lib/types/dao-project/dao-event/dao-event.type';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import SeeRoundDetailsModal from '../../funding-rounds/atoms/SeeRoundDetailsModal.svelte';
	import WalletLabel from '$components/atoms/WalletLabel.svelte';
	import type { FindMap } from '$lib/types/common/find.interface';

	export let event: DaoEvent;
	export let i: number;
	export let daoData: DAOProject;
	export let findNames: FindMap = {};

	const EVENTS_DATA: {
		[event in DaoEventName]: {
			icon: string;
			text: string;
			color: 'primary' | 'secondary' | 'tertiary' | 'alert';
		};
	} = {
		NewFundingCycle: {
			icon: 'tabler:pig-money',
			text: 'New funding cycle',
			color: 'tertiary'
		},
		ProjectCreated: {
			icon: 'tabler:mood-plus',
			text: 'Project created',
			color: 'tertiary'
		},
		Purchase: {
			icon: 'tabler:cash',
			text: 'Purchase',
			color: 'primary'
		},
		Donate: {
			icon: 'tabler:heart-handshake',
			text: 'Donate',
			color: 'primary'
		},
		Withdraw: {
			icon: 'tabler:circle-arrow-up-right',
			text: 'Withdraw',
			color: 'alert'
		},
		BatchWithdraw: {
			icon: 'tabler:circle-arrow-up-right',
			text: 'Withdraw',
			color: 'alert'
		},
		Mint: {
			icon: 'tabler:arrows-move',
			text: 'Mint',
			color: 'alert'
		},
		BatchMint: {
			icon: 'tabler:arrows-move',
			text: 'Mint',
			color: 'alert'
		},
		Burn: {
			icon: 'tabler:flame',
			text: 'Burn',
			color: 'alert'
		},
		UpdateThreshold: {
			icon: 'tabler:signature',
			text: 'Updated threshold',
			color: 'tertiary'
		},
		AddSigner: {
			icon: 'tabler:signature',
			text: 'Added signer',
			color: 'tertiary'
		}
	};
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle icon={EVENTS_DATA[event.type].icon} color={EVENTS_DATA[event.type].color} />
		<span class="event-name">{EVENTS_DATA[event.type].text}</span>
		<div class="column info-wrapper timestamp">
			<span class="date">{formatDate(new Date(event.timestamp))}</span>
		</div>
	</div>
	<div class="row-3">
		{#if (event.type === 'Purchase' || event.type === 'Donate') && event.data.message}
			<div class="header-link" on:click={() => getModal(`message-${i}`).open()} on:keydown>
				<Icon icon="tabler:message" />
			</div>
			<Modal background="var(--clr-background-secondary)" id={`message-${i}`}>
				<span class="special-message-heading">Added Message</span>
				<p class="special-message">{event.data.message}</p>
			</Modal>
		{/if}
		{#if event.type === 'Purchase' || event.type === 'Donate'}
			<WalletLabel address={event.data.by} find={findNames[event.data.by]} />
		{/if}
		{#if event.type === 'Withdraw' || event.type === 'Mint'}
			<WalletLabel address={event.data.to} find={findNames[event.data.to]} />
		{/if}
		{#if event.type === 'Purchase' || event.type === 'Donate' || event.type === 'Withdraw' || event.type === 'BatchWithdraw' || event.type === 'Mint' || event.type === 'BatchMint' || event.type === 'Burn'}
			<Currency
				amount={event.type === 'Withdraw' || event.type === 'BatchWithdraw' || event.type === 'Burn'
					? -Number(event.data.amount)
					: Number(event.data.amount)}
				currency={event.data.tokenSymbol}
				color="heading"
				fontSize="0.85rem"
				decimalNumbers={2}
			/>
		{:else if event.type === 'NewFundingCycle'}
			<SeeRoundDetailsModal
				round={daoData.onChainData.fundingCycles[Number(event.data.newCycleId)]}
				projectToken={daoData.generalInfo.token_symbol}
				paymentToken={daoData.onChainData.paymentCurrency}
				roundNumber={Number(event.data.newCycleId)}
				projectId={daoData.generalInfo.project_id}
				activeRound={daoData.onChainData.currentFundingCycle
					? Number(daoData.onChainData.currentFundingCycle.details.cycleId)
					: null}
			/>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding-block: var(--space-1);

		.timestamp {
			display: unset;
			@media all and (max-width: 700px) {
				display: none;
			}
		}

		.event-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
			margin-right: var(--space-2);
		}

		.info-wrapper {
			margin-right: var(--space-3);

			.date {
				font-size: var(--font-size-0);
				line-height: normal;
				color: var(--clr-text-off);
			}
		}
	}

	.special-message-heading {
		color: var(--clr-heading-main);
	}

	.special-message {
		max-width: 40ch;
		margin-top: var(--space-2);
	}

	.row-3 {
		align-items: center;
	}
</style>
