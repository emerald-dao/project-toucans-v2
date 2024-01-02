<script type="ts">
	import BuiltOnFlow from './atoms/BuiltOnFlow.svelte';
	import { Button } from '@emerald-dao/component-library';
	import FeatureLabel from '../atoms/FeatureLabel.svelte';
</script>

<section class="section-large container-small column-14">
	<div class="title-wrapper column-2 align-center">
		<h1 class="w-medium">
			Fund and govern communities
			<span> effortessly </span>
		</h1>
		<div>
			<p>
				Create a <FeatureLabel icon="mdi:circle-multiple">Token</FeatureLabel>. Unlock transparent <FeatureLabel
					icon="mdi:account-cash">Fundrising</FeatureLabel
				>
				and <FeatureLabel icon="mdi:vote">Voting</FeatureLabel>.
			</p>
			<p>
				Manage funds thorough a secure <FeatureLabel icon="mdi:treasure-chest"
					>Multisig Treasury</FeatureLabel
				>.
			</p>
		</div>
	</div>
	<div class="buttons-wrapper">
		<Button color="neutral" size="large" width="extended" href="/discover">Explore Projects</Button>
		<Button color="primary" size="large" width="extended" href="/dao-generator">Create DAO</Button>
	</div>
	<BuiltOnFlow />
</section>

<style type="scss">
	section {
		text-align: center;
		position: relative;

		.title-wrapper {
			h1 {
				font-size: var(--font-size-10);
				margin-bottom: var(--space-6) 0;
				padding-bottom: 20px;
				line-height: 1.1;

				span {
					background: -webkit-linear-gradient(
						var(--clr-background-primary),
						var(--clr-primary-main)
					);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}

			p {
				max-width: 66ch;
				font-size: var(--font-size-4);
				line-height: 2;
			}
		}

		.buttons-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);
			justify-content: center;

			@include mq('medium') {
				flex-direction: row;
			}
		}
	}
</style>
