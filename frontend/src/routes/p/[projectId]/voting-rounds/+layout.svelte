<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div
	class=""
	style={`
			height: 90px;
			background-image: url(${data.generalInfo.banner_image});
			background-size: cover;
			background-position: center;
			opacity: 0.1;
		`}
/>
<div class="container header-wrapper row-14 align-center justify-center">
	<div class="column align-start">
		{#if $page.params.votingRoundId}
			<Button
				href={`/p/${$page.params.projectId}/voting-rounds`}
				color="neutral"
				type="transparent"
			>
				<Icon icon="tabler:arrow-left" />
				All Voting Rounds
			</Button>
		{:else}
			<Button href={`/p/${$page.params.projectId}`} color="neutral" type="transparent">
				<Icon icon="tabler:arrow-left" />
				DAO Profile
			</Button>
		{/if}
	</div>
	<div class="column-2 align-center">
		<img src={`${data.generalInfo.logo}`} alt="DAO logo" width="70px" height="70px" />
		<div class="column-1 align-center">
			<h1>
				{data.generalInfo.name}
			</h1>
			<span> Voting Rounds </span>
		</div>
	</div>
</div>
<section class="section-small container">
	<slot />
</section>

<style lang="scss">
	.header-wrapper {
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		margin-top: -40px;
		margin-bottom: var(--space-2);

		img {
			border-radius: var(--radius-0);
			border: 1px solid var(--clr-border-primary);
		}

		h1 {
			font-size: var(--font-size-5);
			text-align: center;
		}
		span {
			color: var(--clr-text-off);
			font-size: var(--font-size-3);
			text-align: center;
		}
	}

	section {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
