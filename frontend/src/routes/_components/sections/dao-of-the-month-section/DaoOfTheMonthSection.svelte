<script lang="ts">
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import * as Section from '../atoms/section';

	export let projects: DaoDatabaseData[];
	export let daoOfTheMonth: DaoRankingData;

	const DaoOfTheMonth: DaoDatabaseData = projects.find(
		(project) => project.project_id === daoOfTheMonth.project_id
	) as DaoDatabaseData;
</script>

<section class="section-large">
	<div class="container-small column-12 align-center">
		<Section.Header>
			<Section.Headline>DAO of the Month</Section.Headline>
			<Section.Heading>{DaoOfTheMonth.name}</Section.Heading>
		</Section.Header>
		<div class="project-card-wrapper">
			<ProjectCard project={DaoOfTheMonth} />
		</div>
	</div>
</section>

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
