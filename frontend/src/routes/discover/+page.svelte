<script type="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface.js';

	export let data;
	const projects: DaoDatabaseData[] = data.projects as DaoDatabaseData[];
	const DOMInfo = {
		projectId: 'TestingDAO',
		story: 'This DAO...',
		labels: ['Building', 'Education', 'Community']
	};
	const DOM: DaoDatabaseData = projects.find(
		(project) => project.project_id === DOMInfo.projectId
	) as DaoDatabaseData;
</script>

{#if DOM}
	<section class="container-small">
		<div class="column-12 align-center">
			<h3>DAO of the Month</h3>
			<ProjectCard
				name={DOM.name}
				projectId={DOM.project_id}
				description={DOM.project_id}
				story={DOMInfo.story}
				labels={DOMInfo.labels}
				twitter={DOM.twitter}
				discord={DOM.discord}
				website={DOM.website}
				tokenSymbol={DOM.token_symbol}
			/>
		</div>
	</section>
{/if}

<section class="container-medium">
	<div class="column-12">
		<h3>Explore Projects</h3>
		<div class="wrap">
			{#each projects as project}
				<ProjectCard
					name={project.name}
					image={project.logo}
					projectId={project.project_id}
					description={project.description}
					twitter={project.twitter}
					discord={project.discord}
					website={project.website}
					tokenSymbol={project.token_symbol}
				/>
			{/each}
		</div>
	</div>
</section>

<style type="scss">
	section:first-child {
		border-bottom: 1px var(--clr-border-primary) solid;
	}

	.wrap {
		display: flex;
		flex-direction: row;
		gap: var(--space-8);
		flex-wrap: wrap;
	}
</style>
