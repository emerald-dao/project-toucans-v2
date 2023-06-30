<script type="ts">
	import Icon from '@iconify/svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';
	import { formatDate } from '$lib/utilities/formatDate';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import VotingBar from '$components/atoms/voting/VotingBar.svelte';
	import VotingsWidget from '../../../../../routes/p/[projectId]/_components/sections/widgets/VotingsWidget.svelte';

	export let vote: Vote;
	export let i: number;
	export let status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
	export let discordLink: string | null = null;

	const total = vote.for_total + vote.against_total;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle
			icon={status === 'PENDING'
				? 'tabler:clock'
				: status === 'ACCEPTED'
				? 'tabler:check'
				: 'tabler:x'}
			color={status === 'PENDING' ? 'tertiary' : 'neutral'}
		/>
		<span class="vote-name">{vote.title}</span>
		<div class="column info-wrapper timestamp">
			<span class="date">{formatDate(new Date(vote.created_at))}</span>
		</div>
	</div>
	<div class="row-3 align-center">
		<div class="header-link" on:click={() => getModal(`message-${i}`).open()} on:keydown>
			<Icon icon="tabler:info-circle" />
		</div>
		<Modal background="var(--clr-background-secondary)" id={`message-${i}`}>
			<VotingsWidget votingData={[vote]} transparent={true} title="Votation" {discordLink} />
		</Modal>
		{#if total}
			<div class="voting-bar-wrapper">
				<VotingBar votingData={vote} size="x-small" />
			</div>
		{:else}
			<span class="xsmall">No votes yet</span>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		width: 100%;
		flex-wrap: wrap;
		padding-bottom: var(--space-1);

		.timestamp {
			display: unset;
			@media all and (max-width: 700px) {
				display: none;
			}
		}

		.vote-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-0);
			max-width: 140px;
			line-height: 1.6;
		}

		.info-wrapper {
			margin-right: var(--space-3);

			.date {
				font-size: var(--font-size-0);
				line-height: normal;
				color: var(--clr-text-off);
			}
		}
	}

	.voting-bar-wrapper {
		display: none;

		@include mq('small') {
			width: 140px;
			display: block;
		}
	}
</style>
