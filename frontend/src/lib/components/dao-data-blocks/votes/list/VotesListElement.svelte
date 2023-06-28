<script type="ts">
	import Icon from '@iconify/svelte';
	import { Label, Modal, getModal } from '@emerald-dao/component-library';
	import { formatDate } from '$lib/utilities/formatDate';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';

	export let vote: Vote;
	export let i: number;
	export let status: 'PENDING' | 'ACCEPTED' | 'DECLINED';

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
	<div class="row-3">
		<div class="header-link" on:click={() => getModal(`message-${i}`).open()} on:keydown>
			<Icon icon="tabler:message" />
		</div>
		<Modal background="var(--clr-background-secondary)" id={`message-${i}`}>
			<span class="special-message-heading">Description</span>
			<p class="special-message">{vote.description}</p>
		</Modal>
		{#if total}
			<Label size="xx-small" hasBorder={false}>
				<Icon icon="tabler:check" />
				{Math.round((vote.for_total / total) * 100)}%
			</Label>
			<Label size="xx-small" hasBorder={false} color="alert">
				<Icon icon="tabler:x" />
				{Math.round((vote.against_total / total) * 100)}%
			</Label>
		{:else}
			<span class="xsmall">No votes yet</span>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding-block: var(--space-1);

		.timestamp {
			display: unset;
			@media all and (max-width: 700px) {
				display: none;
			}
		}

		.vote-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-0);
			max-width: 40%;
		}

		.info-wrapper {
			margin-right: var(--space-3);

			// .address {
			// 	font-size: var(--font-size-0);
			// 	margin-bottom: -2px;
			// }

			.date {
				font-size: var(--font-size-0);
				line-height: normal;
				color: var(--clr-text-off);
			}
		}
	}

	.special-message-heading {
		color: var(--clr-heading-main);
	}

	.special-message {
		max-width: 40ch;
		margin-top: var(--space-2);
	}

	.row-3 {
		align-items: center;
	}
</style>
