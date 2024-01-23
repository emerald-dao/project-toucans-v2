<script lang="ts">
	import ChartSvg from './atoms/ChartSvg.svelte';
	import CommunityType from '../atoms/CommunityType.svelte';
	import * as Section from '../atoms/section/';
	import { COMMUNITY_TYPES } from './communityTypes';
</script>

<div class="section-large">
	<div class="container column-10 align-center">
		<Section.Header>
			<Section.Heading>
				<Section.HeadingHighlight>Built for</Section.HeadingHighlight>
				any community.
			</Section.Heading>
			<Section.Description
				>Unlock transparent funding and governance on the Flow Blockchain.</Section.Description
			>
		</Section.Header>
		<div class="badges-wrapper">
			{#each COMMUNITY_TYPES as communityType, i}
				<CommunityType name={communityType.name} icon={communityType.icon} />
			{/each}
		</div>
		<ChartSvg />
	</div>
</div>

<style lang="scss">
	.section-large {
		overflow: hidden;
		border-block: 0.5px solid var(--clr-border-primary);

		.container {
			text-align: center;
			position: relative;

			.badges-wrapper {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				gap: var(--space-4);
				z-index: 1;
			}
		}
	}
</style>
