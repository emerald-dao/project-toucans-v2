<script type="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import Icon from '@iconify/svelte';

	let toucansFeatures = [
		{
			title: 'Raise',
			description:
				'Kickstart your project by raising funds. Automatically issue your own token to funders.',
			icon: 'cash'
		},
		{
			title: 'Treasury',
			description:
				'Manage a multi-signed treasury. Add/remove signers, withdraw, mint, and burn from it.',
			icon: 'building-bank'
		},
		{
			title: 'Token Launch',
			description: 'Launch your own fungible token on the Flow blockchain.',
			icon: 'coin'
		}
	];
</script>

<section class="container">
	<div class="title-wrapper">
		<span class="tagline">Why Start a DAO?</span>
		<h2 class="w-medium">Tokens for any community.</h2>
	</div>
	<div class="cards-wrapper">
		{#each toucansFeatures as feature}
			<div class="card">
				<div class="column-2 align-center">
					<IconCircle icon={`tabler:${feature.icon}`} color="primary" width="1.2rem" />
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style type="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		.title-wrapper {
			@include mq('medium') {
				margin-bottom: var(--space-6);
			}

			h2 {
				margin-top: var(--space-6);
			}
		}

		.cards-wrapper {
			@include mq('medium') {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: var(--space-8);
			}
			.card {
				margin: var(--space-6) 0px;
				background-color: var(--clr-background-primary);
			}
		}
	}
</style>
