<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';
	import { daysOfDifference } from '$lib/utilities/formatDate';

	export let transaction: LockedVaultDetails;
	export let i: number;
	export let projectId: string;

	let currentDate = new Date();
	let unlockTime = new Date(parseInt(transaction.unlockTime) * 1000);
	let daysToUnlock = daysOfDifference(currentDate, unlockTime);
	let timeRemaining: string;
	let availableToClaim = false;

	if (daysToUnlock > 1) {
		timeRemaining = `${daysToUnlock} days until you can claim`;
	} else if (daysToUnlock === 1 || daysToUnlock === 0) {
		timeRemaining = `1 day until you can claim`;
	} else if (daysToUnlock < 0) {
		availableToClaim = true;
	}

	function handleTokenClaim() {
		alert('Add code to execute the claim function');
	}
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle icon="tabler:lock-square" color="alert" />
		<span class="event-name">Locked tokens</span>
	</div>
	<div class="row-3 align-center">
		<div class="dao-label">
			<a class="header-link" href={`/p/${projectId}`}>{projectId}</a>
		</div>
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
