<script lang="ts">
	import LeadingProjectCard from './atoms/leading-project-card/LeadingProjectCard.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';

	export let projectsRakings: DaoRankingData[];

	let selectedTab = 'top-funded-projects';

	let topDaos = projectsRakings
		.sort((a, b) => Number(b.treasury_value) - Number(a.treasury_value))
		.slice(0, 4);

	const mostActiveProject = topDaos
		.sort((a, b) => Number(b.num_participants) - Number(a.num_participants))
		.slice(0, 1)[0];

	const highestValueProject = topDaos
		.sort((a, b) => Number(b.treasury_value) - Number(a.treasury_value))
		.slice(0, 1)[0];

	const highestMarketCap = topDaos
		.sort((a, b) => Number(b.price * b.total_supply) - Number(a.price * a.total_supply))
		.slice(0, 1)[0];
</script>

<section class="section">
	<div class="container column-12 align-center">
		<div class="projects-wrapper">
			{#if selectedTab}
				{#each topDaos as project (project.project_id)}
					<LeadingProjectCard
						{project}
						mostActive={mostActiveProject.project_id == project.project_id}
						highestValue={highestValueProject.project_id == project.project_id}
						highestMarketCap={highestMarketCap.project_id == project.project_id}
					/>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style type="scss">
	section {
		text-align: center;
		background-color: var(--clr-background-secondary);
		border-block: 0.5px solid var(--clr-border-primary);

		.projects-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-6);

			@include mq('small') {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-gap: var(--space-8);
			}
		}
	}
</style>
