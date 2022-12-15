<script type="ts">
	import { Column, Row, AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { Button, Tagline } from '@emerald-dao/component-library';
	import { LeadingProjectCard } from '$components/cards/index';
	import type { LeadingDao } from '$lib/types/leading-dao.interface';

	let toucansFeatures = [
		{
			title: 'Investment',
			description: 'Start and Investment Club. Pool funds and vote on decisions',
			icon: '/flow-logo.png'
		},
		{
			title: 'Collaboration',
			description: 'Fund your project and work towards a common collective goal',
			icon: '/flow-logo.png'
		},
		{
			title: 'Grant',
			description: 'Support a cause. Collectively decide which people & projects to fund',
			icon: '/flow-logo.png'
		}
	];

	let testDaos: LeadingDao[] = [
		{
			logoUrl: '/toucans-logo.svg',
			name: 'Toucans DAO',
			totalInvested: 100,
			currency: 'FLOW',
			numberOfPayments: 20,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/toucans-logo.svg',
			name: 'Toucans DAO',
			totalInvested: 100,
			currency: 'FLOW',
			numberOfPayments: 20,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/toucans-logo.svg',
			name: 'Toucans DAO',
			totalInvested: 100,
			currency: 'FLOW',
			numberOfPayments: 20,
			variationPercentage: 8.2
		},
		{
			logoUrl: '/toucans-logo.svg',
			name: 'Toucans DAO',
			totalInvested: 100,
			currency: 'FLOW',
			numberOfPayments: 20,
			variationPercentage: -8.2
		}
	];
</script>

<div class="section">
	<div class="container-small">
		<Column>
			<h1>Create a token.<br /> Launch a DAO</h1>
			<p>
				Toucans is the first fungible token creation and management platform on the Flow blockchain
				that makes it easy for internet communities unlock the power of human-centric coordination.
			</p>
			<Row gap="small">
				<Button>Launch a Token</Button>
				<Button type="ghost">Browse Projects</Button>
			</Row>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<Tagline>Why Start a DAO?</Tagline>
			<h2>Tokens for any Community</h2>
			<AdaptableGrid minWidth="small">
				{#each toucansFeatures as feature}
					<div class="card-primary">
						<Column justify="center" gap="small">
							<h3>{feature.title}</h3>
							<p>{feature.description}</p>
						</Column>
					</div>
				{/each}
			</AdaptableGrid>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<Tagline>Explore</Tagline>
			<h2>Leading Projects</h2>
			<AdaptableGrid gap="small">
				{#each testDaos as testDao, i}
					<LeadingProjectCard daoData={testDao} number={i + 1} />
				{/each}
			</AdaptableGrid>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<Tagline>No Code Required</Tagline>
			<h2>Creating your own token is easy</h2>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<h2>FAQ</h2>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<h2>Powerd by <strong>Emerald City</strong></h2>
		</Column>
	</div>
</div>

<style type="scss">
	h1,
	p {
		text-align: center;
	}

	h3 {
		font-size: var(--fs-500);
	}
</style>
