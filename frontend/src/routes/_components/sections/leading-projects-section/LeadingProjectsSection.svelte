<script lang="ts">
	import LeadingProjectCard from './atoms/leading-project-card/LeadingProjectCard.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import { LEADING_PROJECTS, type LeadingProjectType } from './leadingProjects';

	export let projectsRakings: DaoRankingData[];

	const leadingProjects = Object.entries(LEADING_PROJECTS).reduce((acc, leadingProject) => {
		const project = projectsRakings.find((prj) => prj.project_id === leadingProject[1].projectId);
		acc[leadingProject[0] as LeadingProjectType] = project;
		return acc;
	}, {} as { [key in LeadingProjectType]: DaoRankingData | undefined });

	let featuredDaosArray = Object.entries(leadingProjects) as [
		LeadingProjectType,
		DaoRankingData | undefined
	][];

	let allFeaturedDaosFound = !Object.values(leadingProjects).some(
		(project) => project === undefined
	);
</script>

{#if allFeaturedDaosFound}
	<section class="section">
		<div class="container-small column-12 align-center">
			<div class="projects-wrapper">
				{#each featuredDaosArray as [key, leadingProject]}
					{#if leadingProject}
						<LeadingProjectCard project={leadingProject} leadingProjectyType={key} />
					{/if}
				{/each}
			</div>
		</div>
	</section>
{/if}

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
				gap: var(--space-10);
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
