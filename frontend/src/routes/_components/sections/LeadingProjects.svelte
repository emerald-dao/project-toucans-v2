<script type="ts">
	import { AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { LeadingProjectCard } from '$components/cards/index';

	let testDaos = [
		{
			logoUrl: '/ec-logo.png',
			name: 'Emerald City',
			totalInvested: 1500,
			currency: 'EMLD',
			numberOfPayments: 12,
			variationPercentage: 8.2,
			projectId: 'EmeraldCity',
			description: 'The first DAO on the Flow blockchain. The creators of Toucans.'
		},
		{
			logoUrl: '/ballerz-fz-logo.jpg',
			name: 'Ballerz FC',
			totalInvested: 1500,
			currency: 'BFC',
			numberOfPayments: 12,
			variationPercentage: 8.2,
			projectId: 'BallerzFC',
			description:
				'A DAO for the ownership and management of Ballerz FC and related assets in the MFL Universe.'
		}
	];
</script>

<section class="section-large">
	<div class="container">
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
	</div>
</section>

<style type="scss">
	section {
		background-color: var(--clr-background-secondary);
		border-block: 1px solid var(--clr-border-primary);

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
	}
</style>
