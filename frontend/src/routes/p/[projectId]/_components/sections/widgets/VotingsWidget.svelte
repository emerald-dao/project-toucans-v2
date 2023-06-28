<script lang="ts">
	import VotingBar from '$components/atoms/VotingBar.svelte';
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let votingData: Vote[];

	console.log(votingData[0]);

	$: pendingVotations = votingData.filter((v) => v.pending === true);

	let activeVotation = 0;
</script>

<div class="card">
	<div class="row-space-between align-center card-header">
		<span class="small row-2 align-center">
			<Icon icon="lucide:vote" />
			Active votations
		</span>

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
				{activeVotation + 1} / {pendingVotations.length}
			</span>

			<div
				class="next-button"
				class:disabled={activeVotation === pendingVotations.length - 1}
				on:click={() => {
					if (activeVotation !== pendingVotations.length - 1) activeVotation++;
				}}
			>
				<Icon icon="tabler:chevron-right" />
			</div>
		</div>

		<Button size="small" color="neutral" width="extended" type="ghost">
			<Icon icon="tabler:brand-discord" />
			Vote
		</Button>
	</div>

	<div class="card-body column-7">
		<div class="column-2">
			<h4>{pendingVotations[activeVotation].title}</h4>
			<p class="small">{pendingVotations[activeVotation].description}</p>
		</div>

		<VotingBar votingData={votingData[activeVotation]} />
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
</style>
