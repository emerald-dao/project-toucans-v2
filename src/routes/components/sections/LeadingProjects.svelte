<script type="ts">
	import { Column, AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { LeadingProjectCard } from '$components/cards/index';
	import type { LeadingDao } from '$lib/types/leading-dao.interface';

	let testDaos: LeadingDao[] = [
		{
			logoUrl: '/leading-projects-logo.png',
			name: 'Emerald City DAO',
			totalInvested: 1500,
			currency: 'FUSD',
			numberOfPayments: 12,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/leading-projects-logo.png',
			name: 'Emerald City DAO',
			totalInvested: 1500,
			currency: 'FUSD',
			numberOfPayments: 12,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/leading-projects-logo.png',
			name: 'Emerald City DAO',
			totalInvested: 1500,
			currency: 'FUSD',
			numberOfPayments: 12,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/leading-projects-logo.png',
			name: 'Emerald City DAO',
			totalInvested: 1500,
			currency: 'FUSD',
			numberOfPayments: 12,
			variationPercentage: -0.5
		}
	];
</script>

<section class="container">
	<div class="title-wrapper">
		<span class="tagline">Explore</span>
		<h2 class="w-medium">Leading Projects</h2>
	</div>
	<div class="projects-wrapper">
		<AdaptableGrid gap="small">
			{#each testDaos as testDao, i}
				<LeadingProjectCard daoData={testDao} number={i + 1} />
			{/each}
		</AdaptableGrid>
	</div>
</section>

<style type="scss">
	.container {
		display: flex;
		flex-direction: column;

		.title-wrapper {
			text-align: center;
			margin-bottom: var(--space-8);

			h2 {
				margin-top: var(--space-6);
			}
		}
	}
</style>
