<script lang="ts">
	import TokenCard from './cards/TokenCard.svelte';
	import FundrisingCard from './cards/FundrisingCard.svelte';
	import TreasuryCard from './cards/TreasuryCard.svelte';
	import VotingCard from './cards/VotingCard.svelte';
</script>

<section class="section-large">
	<div class="container">
		<h2 class="w-medium">
			<span> The ultimate toolbox </span>
			for communities and token creators
		</h2>
		<div class="cards-wrapper">
			<TokenCard />
			<FundrisingCard />
			<TreasuryCard />
			<VotingCard />
		</div>
	</div>
</section>

<style lang="scss">
	section {
		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--space-14);
			border-radius: 20px;
			border: 1px;

			h2 {
				font-size: var(--font-size-9);
				text-align: center;

				span {
					display: block;
					white-space: nowrap;
					background: -webkit-linear-gradient(
						var(--clr-background-primary),
						var(--clr-heading-main)
					);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}

			.cards-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-6);

				@include mq('small') {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					grid-template-rows: repeat(3, auto);
					grid-template-areas:
						'card1 card1'
						'card2 card3'
						'card4 card4';
				}
			}
		}
	}
</style>
