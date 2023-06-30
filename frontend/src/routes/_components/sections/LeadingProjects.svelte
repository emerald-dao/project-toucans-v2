<script type="ts">
	import { AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { LeadingProjectCard } from '$components/cards/index';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';

	export let projects: DaoRankingData[] = [];
	const topProjects = projects.sort((a, b) => b.treasury_value - a.treasury_value).slice(0, 4);
</script>

<section class="section-large">
	<div class="container">
		<div class="title-wrapper">
			<span class="tagline">Explore</span>
			<h2 class="w-medium">Leading Projects</h2>
		</div>
		<div class="projects-wrapper">
			<AdaptableGrid gap="small">
				{#each topProjects as daoData, i}
					<LeadingProjectCard {daoData} number={i + 1} />
				{/each}
			</AdaptableGrid>
		</div>
	</div>
</section>

<style type="scss">
	section {
		background-color: var(--clr-background-secondary);
		border-block: 1px solid var(--clr-border-primary);

		.container {
			display: flex;
			flex-direction: column;

			.title-wrapper {
				text-align: center;
				margin-bottom: var(--space-8);

				h2 {
					margin-top: var(--space-6);
				}
			}
		}
	}
</style>
