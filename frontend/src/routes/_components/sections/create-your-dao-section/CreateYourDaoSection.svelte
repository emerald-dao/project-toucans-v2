<script lang="ts">
	import FeatureItem from './atoms/FeatureItem.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { DAO_TYPES } from './../../../dao-generator/daoTypes';
	import DaoTypeCards from './atoms/DaoTypeCards.svelte';
</script>

<section class="section-large">
	<div class="container-small column-6">
		<div class="column-7">
			<div class="column-4">
				<h2 class="w-medium">Create your DAO in minutes</h2>
				<p>Unlock transparent funding and governance on the Flow Blockchain.</p>
				<ul>
					<FeatureItem>Free</FeatureItem>
					<FeatureItem>Open Source</FeatureItem>
					<FeatureItem>Easy to use</FeatureItem>
					<FeatureItem>Community driven</FeatureItem>
				</ul>
			</div>
			<div class="buttons-wrapper">
				<Button
					href="https://discord.com/invite/emerald-city-906264258189332541"
					type="ghost"
					size="small"
					color="neutral">Contact Us</Button
				>
				<Button href="/dao-generator" size="small" color="primary">Create a DAO for Free</Button>
			</div>
		</div>
		<div class="cards-wrapper">
			{#each DAO_TYPES as daoType}
				<DaoTypeCards {daoType} />
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	section {
		border-top: 0.5px solid var(--clr-border-primary);
		background-color: var(--clr-background-secondary);

		.container-small {
			@include mq('medium') {
				display: grid;
				grid-template-columns: 1fr 1fr;
				text-align: left;
				gap: var(--space-16);
			}

			p {
				font-size: var(--font-size-3);
			}

			h2 {
				font-size: var(--font-size-7);
			}

			ul {
				list-style: none;
				padding-left: 0;
				display: flex;
				flex-direction: column;
				gap: var(--space-3);
			}

			.buttons-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-4);

				@include mq('small') {
					flex-direction: row;
				}
			}

			.cards-wrapper {
				display: flex;
				flex-direction: column;
				justify-content: center;
				gap: var(--space-6);
			}
		}
	}
</style>
