<script lang="ts">
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';

	const userData: UserData = getContext('userData');
</script>

{#if userData.signerOf.length > 0}
	<div class="column-2">
		<DashboardHeading icon="tabler:writing-sign">Signer of</DashboardHeading>
		<div class="dao-labels-wrapper">
			{#each userData.signerOf as dao}
				<div class="dao-label">
					<img src={dao.logoUrl} alt={`${dao.name} logo`} class="dao-logo" />
					<span>{dao.name}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
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

			span {
				font-size: var(--font-size-0);
			}

			.dao-logo {
				width: 18px;
				height: 18px;
				aspect-ratio: 1;
			}
		}
	}
</style>
