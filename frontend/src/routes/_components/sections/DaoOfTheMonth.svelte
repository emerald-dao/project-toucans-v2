<script lang="ts">
	import DaoRankingRow from '$lib/features/dao-ranking/components/atoms/DaoRankingRow.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import FeatureLabel from './atoms/FeatureLabel.svelte';
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import Blur from '$components/Blur.svelte';

	export let projects: DaoDatabaseData[];
	export let daoOfTheMonth: DaoRankingData;

	const DaoOfTheMonth: DaoDatabaseData = projects.find(
		(project) => project.project_id === daoOfTheMonth.project_id
	) as DaoDatabaseData;
</script>

<section class="section-large">
	<div class="container-small column-12 align-center">
		<div class="column-5 align-center">
			<span>DAO of the Month</span>
			<h2 class="w-medium">{DaoOfTheMonth.name}</h2>
		</div>
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
			span {
				font-size: var(--font-size-3);
				line-height: 19px;
				letter-spacing: 0.1em;
				text-transform: uppercase;
				background: -webkit-linear-gradient(var(--clr-background-primary), var(--clr-heading-main));
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}

			h2 {
				font-size: var(--font-size-9);
			}

			.project-card-wrapper {
				max-width: 35ch;
				z-index: 10;
			}
			p {
				font-size: 22px;
				line-height: 30px;
			}
		}
	}
</style>
