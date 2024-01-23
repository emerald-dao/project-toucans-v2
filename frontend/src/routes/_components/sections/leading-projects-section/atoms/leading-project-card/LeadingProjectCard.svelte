<script lang="ts">
	import Image from '$components/Image.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import { LEADING_PROJECTS, type LeadingProjectType } from '../../leadingProjects';
	import LeadingCardHighlightedData from './atoms/LeadingCardHighlightedData.svelte';
	import LeadingCardStat from './atoms/LeadingCardStat.svelte';

	export let project: DaoRankingData;
	export let leadingProjectyType: LeadingProjectType | undefined = undefined;

	const LEADING_PROJECT_DATA = leadingProjectyType
		? LEADING_PROJECTS[leadingProjectyType]
		: undefined;
</script>

{#if project.projects}
	<div class="main-wrapper">
		<a
			href={`/p/${project.project_id}`}
			data-sveltekit-preload-data="hover"
			class="column-space-between column-1 align-left"
		>
			<div class="column-5">
				<Image
					src={project.projects.banner_image ?? 'toucans-illustration.png'}
					alt={`${project.projects.name} banner`}
					height="140px"
					width="100%"
				/>
				<div class="card-content">
					<h3 class="w-medium" style="text-align:left">{project.projects.name}</h3>
					<div class="row-9">
						{#if project.num_participants}
							<LeadingCardStat title="Participants" stat={project.num_participants} />
						{/if}
						{#if project.treasury_value}
							<LeadingCardStat title="Treasury Value" stat={`$${project.treasury_value}`} />
						{/if}
					</div>
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
			background-color: var(--clr-surface-secondary);
			border-radius: var(--radius-3);
			overflow: hidden;
			text-decoration: none;
			color: inherit;
			flex: 1;
			border: 1px solid var(--clr-border-primary);
			transition: all 0.2s ease-in-out;

			&:hover {
				filter: brightness(1.2);
			}

			.card-content {
				padding-inline: var(--space-5);
				text-align: left;
				display: flex;
				flex-direction: column;
				gap: var(--space-2);
				width: 100%;

				h3 {
					font-size: var(--font-size-5);
				}
			}

			.card-footer {
				padding-inline: var(--space-5);
				padding-top: var(--space-3);
				padding-bottom: var(--space-4);
				border-top: 1px solid var(--clr-border-primary);
				margin-top: var(--space-4);
			}
		}
	}
</style>
