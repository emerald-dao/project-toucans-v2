<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let data;
</script>

<section class="section-small container column-6">
	<div class="header-wrapper">
		<div class="column align-start">
			{#if $page.params.votingRoundId}
				<a
					href={`/p/${$page.params.projectId}/voting-rounds`}
					class="header-link row-1 align-center"
				>
					<Icon icon="tabler:arrow-left" />
					All Voting Rounds
				</a>
			{:else}
				<a href={`/p/${$page.params.projectId}`} class="header-link row-1 align-center">
					<Icon icon="tabler:arrow-left" />
					DAO Profile
				</a>
			{/if}
		</div>
		<div class="row-4 align-center">
			<img src={`${data.generalInfo.logo}`} alt="DAO logo" width="50px" height="50px" />
			<div class="column-1 align-start">
				<h1>
					{data.generalInfo.name}
				</h1>
				<span> Voting Rounds </span>
			</div>
		</div>
	</div>
	<slot />
</section>

<style lang="scss">
	section {
		flex: 1;

		.header-wrapper {
			z-index: 1;
			display: grid;
			gap: var(--space-4);

			img {
				border-radius: var(--radius-0);
				border: 1px solid var(--clr-border-primary);
			}

			h1 {
				font-size: var(--font-size-4);
				text-align: center;
			}

			span {
				color: var(--clr-text-off);
				font-size: var(--font-size-2);
				text-align: center;
			}
		}
	}
</style>
