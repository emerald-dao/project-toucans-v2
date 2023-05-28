<script type="ts">
	import { AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { LeadingProjectCard } from '$components/cards/index';
	import type { LeadingProjectData } from '$lib/types/dao-project/leading-project.interface';

	export let projects: LeadingProjectData[] = [];
</script>

<section class="section-large">
	<div class="container">
		<div class="title-wrapper">
			<span class="tagline">Explore</span>
			<h2 class="w-medium">Leading Projects</h2>
		</div>
		<div class="projects-wrapper">
			<AdaptableGrid gap="small">
				{#each projects as daoData, i}
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
