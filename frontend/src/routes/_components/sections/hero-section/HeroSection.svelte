<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import FeatureLabel from '../atoms/FeatureLabel.svelte';
</script>

<section class="section-large container-small column-14">
	<div class="title-wrapper column-2 align-center">
		<h1 class="w-medium">
			Fund and govern communities
			<span> effortlessly. </span>
		</h1>
		<div>
			<p>
				Create a <FeatureLabel icon="mdi:circle-multiple">Token</FeatureLabel>. Unlock transparent <FeatureLabel
					icon="mdi:account-cash">Fundraising</FeatureLabel
				>
				and <FeatureLabel icon="mdi:vote">Voting</FeatureLabel>.
			</p>
			<p>
				Manage funds through a secure <FeatureLabel icon="mdi:treasure-chest"
					>Multisig Treasury</FeatureLabel
				>.
			</p>
		</div>
	</div>
	<div class="buttons-wrapper">
		<Button color="neutral" size="large" width="extended" href="/discover">Discover Projects</Button
		>
		<Button color="primary" size="large" width="extended" href="/dao-generator">Create DAO</Button>
	</div>
</section>

<style type="scss">
	section {
		text-align: center;
		position: relative;
		padding-block: 4rem;

		@include mq('small') {
			padding-block: 6rem;
		}

		.title-wrapper {
			h1 {
				font-size: var(--font-size-8);
				margin-bottom: var(--space-6) 0;
				padding-bottom: 20px;
				line-height: 1.1;

				@include mq('small') {
					font-size: var(--font-size-9);
				}

				@include mq('medium') {
					font-size: var(--font-size-10);
				}

				span {
					background: -webkit-linear-gradient(var(--clr-border-secondary), var(--clr-primary-main));
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}

			p {
				max-width: 66ch;
				font-size: var(--font-size-2);
				line-height: 2;

				@include mq('medium') {
					font-size: var(--font-size-4);
				}
			}
		}

		.buttons-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);
			justify-content: center;

			@include mq('small') {
				flex-direction: row;
			}
		}
	}
</style>
