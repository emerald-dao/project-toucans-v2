<script type="ts">
	import Icon from '@iconify/svelte';
	import { Label, Modal, getModal } from '@emerald-dao/component-library';
	import type { Vote } from '$lib/types/dao-project/dao-project.interface';
	import { formatDate } from '$lib/utilities/formatDate';
	import IconCircle from '$components/atoms/IconCircle.svelte';

	export let vote: Vote;
	export let i: number;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle
			icon={vote.pending ? 'tabler:clock' : 'tabler:check'}
			color={vote.pending ? 'tertiary' : 'neutral'}
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
		<Label size="xx-small" hasBorder={false}>
			{vote.for_total}
			<Icon icon="tabler:check" />
		</Label>
		<Label size="xx-small" hasBorder={false} color="alert">
			{vote.against_total}
			<Icon icon="tabler:x" />
		</Label>
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
