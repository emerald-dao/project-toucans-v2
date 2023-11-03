<script type="ts">
	import { Button, Currency, Label } from '@emerald-dao/component-library';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import { claimLockedTokensExecution } from '$flow/actions';

	export let lockedVault: LockedVaultDetails;
	export let i: number;
	export let projectId: string;
	export let projectOwner: string;
	export let removeClaimedVault: (i: number) => void;

	let currentDate = new Date();
	let unlockTime = new Date(parseInt(lockedVault.unlockTime) * 1000);
	let daysToUnlock = daysOfDifference(currentDate, unlockTime);
	let timeRemaining: string;
	let availableToClaim = Date.now() >= parseInt(lockedVault.unlockTime) * 1000;

	if (daysToUnlock > 1) {
		timeRemaining = `${daysToUnlock} days until you can claim`;
	} else {
		timeRemaining = `1 day until you can claim`;
	}

	async function handleTokenClaim() {
		const result = await claimLockedTokensExecution(
			projectOwner,
			projectId,
			lockedVault.lockedVaultUuid,
			lockedVault.tokenInfo.receiverPath.identifier
		);
		if (result.state === 'success') {
			removeClaimedVault(i);
		}
	}
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle icon="tabler:lock-square" color="alert" />
		<span class="event-name">Locked tokens</span>
		<Currency
			amount={lockedVault.amount}
			currency={lockedVault.tokenInfo.symbol}
			fontSize="var(--font-size-2)"
			decimalNumbers={2}
			color="heading"
		/>
	</div>
	<div class="row-3 align-center">
		{#if availableToClaim}
			<Button on:click={handleTokenClaim} size="x-small">Claim</Button>
		{:else}
			<span class="days-left">{timeRemaining}</span>
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

		.event-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
			margin-right: var(--space-2);
		}

		.dao-label {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
			color: var(--clr-text-main);
			border: 1px solid var(--clr-border-primary);
			padding: 0px var(--space-3);
			border-radius: 20px;
			width: fit-content;

			.header-link {
				font-size: var(--font-size-0);
			}
		}

		.days-left {
			font-size: var(--font-size-0);
		}
	}
</style>
