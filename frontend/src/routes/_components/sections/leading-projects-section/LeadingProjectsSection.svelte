<script lang="ts">
	import TabsWrapper from './atoms/tabs/TabsWrapper.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import Tab from './atoms/tabs/Tab.svelte';
	import { TABS } from './config/tabs';

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
				<div class="tarj column align-center">
					<img
						src={project.banner_image ?? 'toucans-illustration.png'}
						on:error={(e) => handleBannerImgError(e)}
						alt={`${project.name} banner`}
						class="banner"
					/>
					<div class="card-content">
						<h3 class="w-medium" style="text-align:left">{project.name}</h3>
						<p class="small" style="text-align:left">{project.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style type="scss">
	section {
		text-align: center;
		background-color: var(--clr-background-secondary);
		border-block: 1px solid var(--clr-neutral-badge);

		.projects-wrapper {
			display: flex;
			flex-direction: column;
			gap: 30px;

			@include mq('small') {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-gap: 50px;
			}
		}
	}

	.tarj {
		background-color: var(--clr-neutral-badge);
		border-radius: 10px;
		overflow: hidden;

		.banner {
			width: 100%;
			height: 160px;
			object-fit: cover;
		}

		.card-content {
			padding: var(--space-5) var(--space-5);
			text-align: left;
			display: flex;
			flex-direction: column;
			gap: 8px;
			width: 100%;

			h3 {
				font-size: var(--font-size-4);
			}

			p {
				// max 4 lines
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: var(--font-size-1);
			}
		}
	}
</style>
