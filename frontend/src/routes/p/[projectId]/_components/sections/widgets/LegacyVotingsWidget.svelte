<script lang="ts">
	import VotingStatusCard from '$components/atoms/voting/VotingStatusCard.svelte';
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let votingData: Vote[];
	export let transparent = false;
	export let title = 'Legact active votations';
	export let discordLink: string | null = null;

	let activeVotation = 0;
</script>

<div class="card" class:transparent>
	<div class="card-header" class:transparent>
		<span class="small row-2 align-center">
			<Icon icon="lucide:vote" />
			{title}
		</span>

		{#if votingData.length > 1}
			<div class="pagination row-8">
				<div
					class="previous-button"
					class:disabled={activeVotation === 0}
					on:click={() => {
						if (activeVotation > 0) activeVotation--;
					}}
				>
					<Icon icon="tabler:chevron-left" />
				</div>

				<span class="xsmall">
					{activeVotation + 1} / {votingData.length}
				</span>

				<div
					class="next-button"
					class:disabled={activeVotation === votingData.length - 1}
					on:click={() => {
						if (activeVotation !== votingData.length - 1) activeVotation++;
					}}
				>
					<Icon icon="tabler:chevron-right" />
				</div>
			</div>
		{/if}

		{#if discordLink && votingData[activeVotation].pending === true}
			<Button
				size="small"
				color="neutral"
				width="extended"
				type="ghost"
				href={votingData[activeVotation].discord_message_link}
				target="_blank"
			>
				<Icon icon="tabler:brand-discord" />
				Vote
			</Button>
		{/if}
	</div>

	<div class="card-body column-7">
		<div class="column-2">
			<h4>{votingData[activeVotation].title}</h4>
			<p class="small">{votingData[activeVotation].description}</p>
		</div>

		<VotingStatusCard
			forVotes={votingData[activeVotation].for_total}
			againstVotes={votingData[activeVotation].against_total}
			isPending={votingData[activeVotation].pending}
		/>
	</div>
</div>

<style lang="scss">
	.card {
		background-color: var(--clr-background-secondary);
		padding: 0;
		overflow: hidden;

		.card-header,
		.card-body {
			padding-inline: var(--space-7);
		}

		.card-header {
			background-color: var(--clr-surface-primary);
			padding-block: var(--space-5) var(--space-3);
			border-bottom: 1px solid var(--clr-neutral-badge);
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-3);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;

			&.transparent {
				background-color: transparent;
			}

			.pagination {
				.next-button,
				.previous-button {
					cursor: pointer;

					&.disabled {
						color: var(--clr-text-off);
						cursor: not-allowed;
					}
				}
			}
		}

		.card-body {
			padding-block: var(--space-7) var(--space-8);
		}

		h4 {
			font-size: var(--font-size-3);
		}

		p {
			max-width: 55ch;
			word-break: break-word;
		}
	}

	.transparent {
		background-color: transparent;
		border: none;
	}
</style>
