<script lang="ts">
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import { LEADING_PROJECTS, type LeadingProjectType } from '../../leadingProjects';
	import LeadingCardHighlightedData from './atoms/LeadingCardHighlightedData.svelte';
	import LeadingProjectCardLabel from './atoms/LeadingProjectCardLabel.svelte';

	export let project: DaoRankingData;
	export let leadingProjectyType: LeadingProjectType | undefined = undefined;

	const LEADING_PROJECT_DATA = leadingProjectyType
		? LEADING_PROJECTS[leadingProjectyType]
		: undefined;

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
			class="column-space-between column-1 align-left"
		>
			<div class="column-5">
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
			</div>
			{#if leadingProjectyType && LEADING_PROJECT_DATA}
				{@const featuredProperty = LEADING_PROJECT_DATA.featuredProperty.property}
				{#if featuredProperty && project[featuredProperty]}
					<div class="card-footer">
						<LeadingCardHighlightedData
							data={project[featuredProperty]}
							description={LEADING_PROJECT_DATA.featuredProperty.description}
							type={leadingProjectyType}
						/>
					</div>
				{/if}
				<div class="label-container row-3 row-space-between">
					<LeadingProjectCardLabel
						>{LEADING_PROJECTS[leadingProjectyType].title}</LeadingProjectCardLabel
					>
				</div>
			{/if}
		</a>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;

		a {
			background-color: var(--clr-surface-primary);
			border-radius: 10px;
			overflow: hidden;
			text-decoration: none;
			color: inherit;
			flex: 1;
			border: 1px solid var(--clr-border-primary);
			transition: all 0.2s ease-in-out;
			padding-bottom: var(--space-5);

			&:hover {
				background-color: var(--clr-surface-secondary);
			}

			.banner {
				width: 100%;
				height: 160px;
				object-fit: cover;
			}

			.card-content {
				padding-inline: var(--space-5);
				text-align: left;
				display: flex;
				flex-direction: column;
				gap: var(--space-2);
				width: 100%;

				h3 {
					font-size: var(--font-size-4);
				}

				p {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
					font-size: var(--font-size-1);
				}
			}

			.card-footer {
				padding-inline: var(--space-5);
			}

			.label-container {
				position: absolute;
				top: var(--space-3);
				left: var(--space-4);
			}
		}
	}
</style>
