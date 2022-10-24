<script type="ts">
	import { AdminNav } from './components';
	import { Container, Section } from '@mateoroldos/svelte.bones';
	import { setContext } from 'svelte';
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import { Currencies } from '$lib/types/currencies.enum';

	// TODO: Get all data from the blockchain and share it with a context
	setContext<FullDaoProject>('dao-data', {
		daoName: 'Emerald City',
		daoAddress: '0xfew32490432nm',
		tokenName: 'ECDAO',
		funderAddress: '0xfew32490432nm',
		stats: {
			totalMoneyRised: 32134
		},
		rounds: [
			{
				status: 'active',
				currency: Currencies.FLOW,
				goal: 1000,
				raised: 880,
				startDate: new Date('December 17, 1995 03:24:00'),
				finishDate: new Date('December 17, 2023 03:24:00'),
				distributed: false,
				withdrawn: false
			},
			{
				status: 'finished',
				currency: Currencies.FLOW,
				goal: 2000,
				raised: 1400,
				startDate: new Date('December 17, 1995 03:24:00'),
				finishDate: new Date('December 17, 2023 03:24:00'),
				distributed: true,
				withdrawn: false
			},
			{
				status: 'finished',
				currency: Currencies.FLOW,
				goal: 2000,
				raised: 2200,
				startDate: new Date('December 17, 1995 03:24:00'),
				finishDate: new Date('December 17, 2023 03:24:00'),
				distributed: false,
				withdrawn: true
			},
			{
				status: 'finished',
				currency: Currencies.FUSD,
				goal: 1000,
				raised: 700,
				startDate: new Date('December 17, 1995 03:24:00'),
				finishDate: new Date('December 17, 2023 03:24:00'),
				distributed: false,
				withdrawn: false
			}
		],
		activity: [
			{
				type: 'entry',
				currency: Currencies.FLOW,
				amount: 100,
				account: '0xkfnlwqjkn34'
			}
		]
	});
</script>

<Section>
	<Container width="large">
		<div class="main-wrapper">
			<AdminNav />
			<div class="content-wrapper">
				<slot />
			</div>
		</div>
	</Container>
</Section>

<style type="scss">
	@use '../../lib/styles/utils' as *;

	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 3fr;
		}

		.content-wrapper {
			width: 100%;
			padding: 2.6rem;
		}
	}
</style>
