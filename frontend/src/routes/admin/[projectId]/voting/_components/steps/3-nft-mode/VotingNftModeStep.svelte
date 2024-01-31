<script lang="ts">
	import VotingNftModeCard from './atoms/VotingNftModeCard.svelte';
	import { VOTING_MODES } from './votingModes';
	import { votingGeneratorNftMode } from '../../../votingGeneratorData';
</script>

<div class="main-wrapper">
	{#each VOTING_MODES as { slug, title, description }}
		<VotingNftModeCard {slug} {title} {description} bind:selectedSlug={$votingGeneratorNftMode} />
	{/each}
</div>

<style lang="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}
</style>
