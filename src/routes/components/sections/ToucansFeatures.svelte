<script type="ts">
	let toucansFeatures = [
		{
			title: 'Grant',
			description: 'Support a cause. Collectively decide which people & projects to fund',
			icon: '/flow-logo.png'
		},
		{
			title: 'Investment',
			description: 'Start and Investment Club. Pool funds and vote on decisions',
			icon: '/flow-logo.png'
		},
		{
			title: 'Collaboration',
			description: 'Fund your project and work towards a common collective goal',
			icon: '/flow-logo.png'
		}
	];
</script>

<section class="container-large">
	<div class="title-wrapper">
		<span class="tagline">Why Start a DAO?</span>
		<h2 class="w-medium">Tokens for any Community</h2>
	</div>
	<div class="cards-wrapper">
		{#each toucansFeatures as feature}
			<div class="card-primary">
				<div class="column-2 align-center">
					<img src="/frame-125.png" alt="frame" />
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style type="scss">
	.container-large {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		.title-wrapper {
			@include mq('medium') {
				margin-bottom: var(--space-12);
			}

			h2 {
				margin-top: var(--space-6);
			}
		}

		.cards-wrapper {
			@include mq('medium') {
				display: flex;
				flex-direction: row;
			}
			.card-primary {
				margin: var(--space-6) 0px;

				@include mq('medium') {
					margin: 0px var(--space-4);
				}
			}
		}
	}
</style>
