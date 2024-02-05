<script lang="ts">
	import VotingWidget from './_components/voting-widget/VotingWidget.svelte';

	export let data;
</script>

<section class="container column-3">
	<VotingWidget votingRounds={data.votingRounds} />
</section>
