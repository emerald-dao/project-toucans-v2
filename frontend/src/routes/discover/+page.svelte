<script type="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface.js';

	export let data;
	console.log(data);
	const projects: DaoDatabaseData[] = data.allProjects as DaoDatabaseData[];
	const DOMInfo = {
		projectId: 'BallerzFC',
		story:
			'One of the first DAOs created on the platform, Ballerz FC has formed a strong community of Ballerz FC and broader MFL lovers.',
		labels: ['Community']
	};
	const DOM: DaoDatabaseData = projects.find(
		(project) => project.project_id === DOMInfo.projectId
	) as DaoDatabaseData;
</script>

{#if DOM}
	<section class="container-small border-bottom">
		<div class="column-12 align-center">
			<h3>DAO of the Month</h3>
			<ProjectCard
				name={DOM.name}
				projectId={DOM.project_id}
				description={DOM.description}
				story={DOMInfo.story}
				labels={DOMInfo.labels}
				twitter={DOM.twitter}
				discord={DOM.discord}
				website={DOM.website}
				tokenSymbol={DOM.token_symbol}
				image={DOM.logo}
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
	.border-bottom {
		border-bottom: 1px var(--clr-border-primary) solid;
	}

	.wrap {
		display: grid;
		gap: var(--space-4);

		@include mq(small) {
			grid-template-columns: 1fr 1fr;
		}

		@include mq(medium) {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
