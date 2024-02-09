<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import VotingWidget from './_components/voting-widget/VotingWidget.svelte';

	export let data;

	$: roundIndex = Number($page.url.searchParams.get('round'));

	onMount(() => {
		if (roundIndex === undefined && data.votingRounds.length > 0) {
			goto(`/p/${$page.params.projectId}/voting-rounds?round=0`);
		}
	});

	const onNextVotingRound = () => {
		const nextRound = Number(roundIndex) + 1;
		goto(`/p/${$page.params.projectId}/voting-rounds?round=${nextRound}`);
	};

	const onPreviousVotingRound = () => {
		const previousRound = Number(roundIndex) - 1;
		goto(`/p/${$page.params.projectId}/voting-rounds?round=${previousRound}`);
	};
</script>

{#if data.votingRounds.length === 0}
	<em>No voting rounds available</em>
{:else if roundIndex >= 0 && data.votingRounds[roundIndex]}
	<div class="main-wrapper">
		<VotingWidget votingRound={data.votingRounds[roundIndex]} />
		<div class="row-3 row-space-between">
			<button on:click={onPreviousVotingRound} disabled={roundIndex === 0}>previous</button>
			<button on:click={onNextVotingRound} disabled={roundIndex === data.votingRounds.length - 1}
				>next</button
			>
		</div>
	</div>
{:else}
	<em>We couldn't find the indicated voting round</em>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
