<script lang="ts">
	import FeautreLabel from './atoms/FeatureLabel.svelte';
</script>

<section class="section-large">
	<div class="container">
		<h2 class="w-medium">
			<span> The ultimate toolbox </span>
			for communities and token creators
		</h2>
		<div class="cards-wrapper">
			<div class="techincal-card with-padding" style={`grid-area: card1`}>
				<FeautreLabel icon="mdi:circle-multiple">Token</FeautreLabel>
				<h3 class="w-medium">Create a Token</h3>
				<!-- lorem ipsum -->
				<p>Flow is a fast, decentralized, and developer-friendly blockchain.</p>
				<img src="/FlowDevelopersCommunity.png" alt="Flow developers" />
			</div>
			<div class="techincal-card with-padding" style={`grid-area: card2`}>
				<FeautreLabel icon="mdi:account-cash">Fundrising</FeautreLabel>
				<h3 class="w-medium">Transparent fundrising</h3>
				<p>Flow is a fast, decentralized, and developer-friendly blockchain.</p>
				<img src="/CrowdfundingYourDreams.png" alt="Flow developers" style="padding-top:50px;" />
			</div>
			<div class="techincal-card" style={`grid-area: card3;`}>
				<FeautreLabel icon="mdi:treasure-chest">Multisig Treasury</FeautreLabel>
				<h3 class="w-medium">Manage funds securely</h3>
				<p>Flow is a fast, decentralized, and developer-friendly blockchain.</p>
				<div class="transaction-image">
					<img
						src="/transactions.png"
						alt="Flow developers"
						style="margin:1px; width:35%; height:90%"
					/>
					<img
						src="/treasuryWallet.png"
						alt="Flow developers"
						style="padding-top:70px; padding-bottom:10px;margin-right:1px ;width:55%"
					/>
				</div>
			</div>
			<div class="techincal-card with-padding" style={`grid-area: card4;`}>
				<FeautreLabel icon="mdi:vote">Voting</FeautreLabel>
				<h3 class="w-medium">Transparent voting</h3>
				<p>Flow is a fast, decentralized, and developer-friendly blockchain.</p>
				<img src="/Voting.png" alt="Flow developers" />
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
			text-align: center;
			border: 1px;

			p {
				font-size: var(--font-size-4);
				line-height: 1.5;
			}

			h2 {
				font-size: var(--font-size-9);

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
				gap: var(--space-12);

				@include mq('small') {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					grid-template-rows: repeat(3, auto);
					grid-template-areas:
						'card1 card1'
						'card2 card3'
						'card4 card4';
				}

				.techincal-card {
					background: linear-gradient(
						180deg,
						rgba(255, 102, 196, 0.06) 0%,
						rgba(18, 18, 18, 0) 100%
					);
					padding-top: 40px;
					position: relative;
					border: 1px solid var(--clr-border-primary);
					border-radius: var(--radius-3);
					display: flex;
					flex-direction: column;
					gap: var(--space-5);
					align-items: center;

					.transaction-image {
						display: flex;
						img {
							align-items: baseline;
							max-width: 100%;
							height: auto;
							width: 40%;
						}
					}
					img {
						display: block;
						margin: 0 auto;
						margin-bottom: 1px;
						max-width: 100%;
					}

					h3 {
						font-size: var(--font-size-6);
					}
				}
				.with-padding {
					padding-left: 80px;
					padding-right: 80px;
				}
			}
		}
	}
</style>
