<script lang="ts">
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import * as Section from '../atoms/section';
	import LeadingProjectCard from '../leading-projects-section/atoms/leading-project-card/LeadingProjectCard.svelte';

	export let daoOfTheMonth: DaoRankingData;
</script>

{#if daoOfTheMonth.projects}
	<section class="section-large">
		<div class="container-small column-12 align-center">
			<Section.Header>
				<Section.Headline>DAO of the Month</Section.Headline>
				<Section.Heading>{daoOfTheMonth.projects.name}</Section.Heading>
			</Section.Header>
			<div class="project-card-wrapper">
				<LeadingProjectCard project={daoOfTheMonth} />
			</div>
		</div>
	</section>
{/if}

<style lang="scss">
	section {
		text-align: center;
		position: relative;
		overflow: hidden;

		.container-small {
			.project-card-wrapper {
				max-width: 35ch;
				z-index: 10;
			}
		}
	}
</style>
