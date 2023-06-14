<script lang="ts">
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';

	const userData: UserData = getContext('userData');
</script>

{#if userData.signerOf.length > 0}
	<div class="row-2 align-center main-wrapper">
		<span class="xsmall">Signer of</span>
		<div class="dao-labels-wrapper">
			{#each userData.signerOf as dao}
				<div class="dao-label">
					<img src={dao.logoUrl} alt={`${dao.name} logo`} class="dao-logo" />
					<span class="xsmall">{dao.name}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		flex-wrap: wrap;

		.dao-labels-wrapper {
			display: flex;
			flex-direction: row;
			gap: var(--space-2);
			align-items: center;
			flex-wrap: wrap;

			.dao-label {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: var(--space-1);
				color: var(--clr-text-main);
				border: 1px solid var(--clr-border-primary);
				padding: 2px var(--space-3);
				border-radius: 20px;
				width: fit-content;

				.dao-logo {
					width: 16px;
					height: 16px;
					aspect-ratio: 1;
				}
			}
		}
	}
</style>
