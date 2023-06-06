<script lang="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

	export let projects: DaoDatabaseData[];
</script>

<section class="container-small">
	<div class="column-12">
		<h3 class="w-medium">Explore Projects</h3>
		<div class="wrap">
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>

<style type="scss">
	.wrap {
		display: grid;
		gap: var(--space-11);

		@include mq(small) {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
