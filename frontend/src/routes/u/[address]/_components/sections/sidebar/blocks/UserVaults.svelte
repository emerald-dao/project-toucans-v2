<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import UserVault from './UserVault.svelte';

	export let userData: UserData;

	const selectedVaultStore: Writable<number | null> = getContext('selectedVault');

	let activePage = 0;

	const vaultsPerPage = 3;

	$: vaultsToShow = userData.vaults.slice(
		activePage * vaultsPerPage,
		(activePage + 1) * vaultsPerPage
	);
	$: numberOfPages = Math.ceil(userData.vaults.length / vaultsPerPage);

	// If the selectedVault is not inside the actual page, change the page
	$: if ($selectedVaultStore !== null) {
		if (
			$selectedVaultStore >= (activePage + 1) * vaultsPerPage ||
			$selectedVaultStore <= activePage * vaultsPerPage
		) {
			activePage = Math.floor($selectedVaultStore / vaultsPerPage);
		}
	}
</script>

<div class="balances-wrapper">
	<div class="column-3">
		<DashboardHeading icon="tabler:writing-sign">Vaults</DashboardHeading>
		{#if userData.vaults.length > 0}
			{#each vaultsToShow as vault, i}
				<UserVault {vault} {i} {activePage} {vaultsPerPage} />
			{/each}
		{:else}
			<span class="small"><em>This user has no vaults</em></span>
		{/if}
	</div>
	{#if userData.vaults.length > vaultsPerPage}
		<div class="pagination">
			<div>
				{#if activePage > 0}
					<div on:click={() => (activePage -= 1)} class="header-link">
						<Icon icon="tabler:arrow-left" />
					</div>
				{/if}
			</div>
			<div class="page-number">
				<span class="xsmall">
					{activePage + 1}
					<span class="off">
						/ {numberOfPages}
					</span>
				</span>
			</div>
			<div class="justify-end">
				{#if activePage < numberOfPages - 1}
					<div on:click={() => (activePage += 1)} class="header-link">
						<Icon icon="tabler:arrow-right" />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.balances-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		justify-content: space-between;
		flex: 1;

		h4 {
			font-size: var(--font-size-2);
			color: var(--clr-text-off);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}

		.pagination {
			display: grid;
			grid-template-columns: 1fr 3fr 1fr;
			padding-inline: var(--space-9);

			.off {
				color: var(--clr-text-off);
			}

			& > div {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.page-number {
				display: flex;
				justify-content: center;
			}
		}
	}

	em {
		color: var(--clr-text-off);
	}
</style>
