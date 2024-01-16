<script lang="ts">
	import TabsWrapper from './atoms/tabs/TabsWrapper.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import Tab from './atoms/tabs/Tab.svelte';
	import { TABS } from './config/tabs';
	import LeadingProjectCard from './atoms/LeadingProjectCard.svelte';

	export let allProjects: DaoDatabaseData[] = [];

	let selectedTab: string;
</script>

<section class="section">
	<div class="container column-12 align-center">
		<TabsWrapper>
			{#each TABS as { value, label }}
				<Tab bind:selectedTab {value}>
					{label}
				</Tab>
			{/each}
		</TabsWrapper>
		<div class="projects-wrapper">
			{#each allProjects as project (project.project_id)}
				<LeadingProjectCard {project} />
			{/each}
		</div>
	</div>
</section>

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
				grid-template-columns: repeat(4, 1fr);
				grid-gap: var(--space-8);
			}
		}
	}
</style>
