<script type="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface.js';

	export let data;
	const projects: DaoDatabaseData[] = data.projects as DaoDatabaseData[];
</script>

<section class="container-small">
	<div class="column-12 align-center">
		<h3>DAO of the Month</h3>
		<ProjectCard
			name={'Emerald City'}
			projectId={'EmeraldCity'}
			description={'A DAO for the people!'}
			story={true}
			labels={['Building', 'Education', 'Community']}
		/>
	</div>
</section>

<section class="container-medium">
	<div class="column-12">
		<h3>Trending Projects</h3>
		<div class="wrap">
			{#each projects as project}
				<ProjectCard
					name={project.name}
					image={project.logo}
					projectId={project.project_id}
					description={project.description}
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
