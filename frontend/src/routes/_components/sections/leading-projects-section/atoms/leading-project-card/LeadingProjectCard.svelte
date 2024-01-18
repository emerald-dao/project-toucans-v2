<script lang="ts">
	import HighestMarketCapRankingLabel from './leading-project-card-ranking-label/HighestMarketCapRankingLabel.svelte';
	import HighestValueRankingLabel from './leading-project-card-ranking-label/HighestValueRankingLabel.svelte';
	import MostActiveRankingLabel from './leading-project-card-ranking-label/MostActiveRankingLabel.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';

	export let project: DaoRankingData;

	export let mostActive = false;
	export let highestValue = false;
	export let highestMarketCap = false;

	function handleBannerImgError(e: Event) {
		const target = e.target as HTMLImageElement;
		target.src = 'toucans-illustration.png';
	}
</script>

{#if project.projects}
	<div class="main-wrapper">
		<a
			href={`/p/${project.project_id}`}
			data-sveltekit-preload-data="hover"
			class="column align-center"
		>
			<img
				src={project.projects.banner_image ?? 'toucans-illustration.png'}
				on:error={(e) => handleBannerImgError(e)}
				alt={`${project.projects.name} banner`}
				class="banner"
			/>
			<div class="card-content">
				<h3 class="w-medium" style="text-align:left">{project.projects.name}</h3>
				<p class="small" style="text-align:left">{project.projects.description}</p>
			</div>
		</a>
		<div class="label-wrapper">
			{#if mostActive}
				<MostActiveRankingLabel />
			{/if}
			{#if highestValue}
				<HighestValueRankingLabel />
			{/if}
			{#if highestMarketCap}
				<HighestMarketCapRankingLabel />
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;

		a {
			background-color: var(--clr-surface-primary);
			border-radius: 10px;
			overflow: hidden;
			text-decoration: none;
			color: inherit;
			flex: 1;
			border: 1px solid var(--clr-border-primary);
			transition: all 0.2s ease-in-out;

			&:hover {
				background-color: var(--clr-surface-secondary);
			}

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

		.label-wrapper {
			position: absolute;
			top: -10px;
			width: 100%;
		}
	}
</style>
