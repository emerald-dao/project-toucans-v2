<script lang="ts">
	import NftTreasuryCard from './cards/NftTreasuryCard.svelte';
	import TokenCard from './cards/TokenCard.svelte';
	import FundraisingCard from './cards/FundraisingCard.svelte';
	import TreasuryCard from './cards/TreasuryCard.svelte';
	import VotingCard from './cards/VotingCard.svelte';
	import * as Section from '../atoms/section';
	import { MOCK_DAO } from './mockDao';
</script>

<section class="section-large">
	<div class="container">
		<Section.Header>
			<Section.Heading>
				<Section.HeadingHighlight>The ultimate toolbox for</Section.HeadingHighlight>
				communities and token creators.
			</Section.Heading>
		</Section.Header>
		<div class="cards-wrapper">
			<TokenCard daoData={MOCK_DAO} />
			<div class="grid">
				<FundraisingCard />
				<TreasuryCard />
			</div>
			<div class="grid inverse">
				<VotingCard />
				<NftTreasuryCard />
			</div>
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

			.cards-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-6);
				width: 100%;

				.grid {
					display: flex;
					flex-direction: column;
					gap: var(--space-6);

					@include mq('medium') {
						display: grid;
						grid-template-columns: 2fr 3fr;

						&.inverse {
							grid-template-columns: 7fr 6fr;
						}
					}
				}
			}
		}
	}
</style>
