<script lang="ts">
	import Image from '$components/Image.svelte';
	import { getCatalogByCollectionIDs } from '$flow/actions';
	import type { VotingRoundStore } from '$lib/features/voting-generator/utils/createVotingRoundStore';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { VOTING_NFT_MODES } from '../../../../../../admin/[projectId]/voting/_components/steps/3-nft-mode/votingNftModes';
	import VotingEligibilityLabel from './VotingEligibilityLabel.svelte';
	import VotingRoundTimer from './VotingRoundTimer.svelte';

	export let votingRound: VotingRound;
	export let votingRoundStore: VotingRoundStore;
</script>

<div class="card">
	<div class="voting-round-data-wrapper">
		<div class="column-7">
			<div class="column-3">
				<h4 class="w-medium">
					{votingRound.name}
				</h4>
				<VotingEligibilityLabel
					votingStatus={$votingRoundStore.votingStatus}
					votingEligibilityPromise={$votingRoundStore.votingEligibility}
				/>
				{#if votingRound.description}
					<p class="small">{votingRound.description}</p>
				{/if}
			</div>
			{#if $votingRoundStore.votingStatus === 'active' && $votingRoundStore.remainingTime}
				<VotingRoundTimer
					remainingTime={$votingRoundStore.remainingTime}
					votingStatus={$votingRoundStore.votingStatus}
				/>
			{:else if $votingRoundStore.votingStatus === 'upcoming' && $votingRoundStore.remainingTime}
				<VotingRoundTimer
					remainingTime={$votingRoundStore.remainingTime}
					votingStatus={$votingRoundStore.votingStatus}
				/>
			{/if}
			<div class="nft-mode-wrapper">
				<div class="nft-mode-data-wrapper">
					<div class="voting-mode-label">
						{VOTING_NFT_MODES[votingRound.nft_mode].title}
					</div>
					<p class="xsmall">{VOTING_NFT_MODES[votingRound.nft_mode].description}</p>
				</div>
				{#if votingRound.required_nft_collection_id}
					{#await getCatalogByCollectionIDs( [votingRound.required_nft_collection_id] ) then nftCollections}
						{#if nftCollections}
							{@const nftCollection = Object.values(nftCollections)[0]}
							<div class="nft-collection-wrapper column-1">
								<span>
									{nftCollection.name}
								</span>
								<Image
									src={nftCollection.image}
									alt={`${nftCollection.name} logo`}
									width="100%"
									height="auto"
								/>
							</div>
						{:else}
							<p>Collection not found</p>
						{/if}
					{/await}
				{/if}
			</div>
		</div>
	</div>
	<div class="voting-round-results-wrapper">
		<slot />
	</div>
</div>

<style lang="scss">
	.card {
		display: grid;
		grid-template-columns: 1fr;
		padding: 0;
		overflow: hidden;
		border-radius: var(--radius-1);

		@include mq('medium') {
			grid-template-columns: 1fr 2fr;
		}

		.voting-round-data-wrapper {
			background-color: var(--clr-background-secondary);
			border-right: 0.5px solid var(--clr-border-primary);

			h4 {
				font-size: var(--font-size-5);

				span {
					color: var(--clr-text-off);
					font-size: var(--font-size-4);
				}
			}
		}

		.voting-round-results-wrapper,
		.voting-round-data-wrapper {
			padding: var(--space-7);

			@include mq('medium') {
				padding: var(--space-9);
			}
		}

		.nft-mode-wrapper {
			display: grid;
			grid-auto-columns: 1fr;
			grid-auto-flow: column;
			gap: var(--space-2);
			background-color: var(--clr-surface-primary);
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-1);
			overflow: hidden;

			.nft-mode-data-wrapper,
			.nft-collection-wrapper {
				padding: var(--space-4);
			}

			.nft-mode-data-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-2);

				.voting-mode-label {
					background-color: var(--clr-tertiary-badge);
					border: 1px solid var(--clr-tertiary-badge);
					color: var(--clr-tertiary-main);
					padding: 0 var(--space-2);
					font-size: var(--font-size-0);
					width: fit-content;
					border-radius: var(--radius-0);
				}
			}

			.nft-collection-wrapper {
				background-color: var(--clr-surface-secondary);
				border-left: 0.5px solid var(--clr-border-primary);

				span {
					color: var(--clr-heading-main);
					text-align: center;
				}
			}
		}
	}
</style>
