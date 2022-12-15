<script type="ts">
	import CommunityProject from './components/sections/CommunityProject.svelte';
	import {
		DaoTags,
		DaoType,
		type CommunityDao,
		type FinancialDao
	} from '$lib/types/dao-project.interface';
	import { ProjectSidebarSection } from './components';
	import { Section, Container } from '@mateoroldos/svelte.bones';
	import FinancialProject from './components/sections/FinancialProject.svelte';
	import { Currencies } from '$lib/types/currencies.enum';

	let daoData: FinancialDao | CommunityDao = {
		name: 'Emerald City DAO',
		type: DaoType.Community,
		address: '0x3fewqnj35',
		token: 'ECDAO',
		founder: 'Jacob Tucker',
		dateFounded: new Date(11 / 10 / 2019),
		logoUrl: '/ec-logo.png',
		tags: [DaoTags.Building, DaoTags.Community],
		description:
			'Enim veniam veniam ex ut eiusmod adipisicing cillum nulla excepteur. Ullamco deserunt Lorem non quis. Dolor dolore voluptate non tempor est non aliquip officia Lorem nulla cupidatat enim excepteur. Non proident pariatur minim anim. Adipisicing reprehenderit elit dolor eiusmod do enim fugiat.',
		socials: {
			website: 'ecdao.org',
			twitter: 'emerald-dao',
			discord: 'emerald-dao'
		},
		totalTokens: 8000000,
		mainHolders: [
			['dene.find', 80000],
			['jacob.find', 80000],
			['mateo.find', 80000],
			['bz.find', 80000]
		]
		// totalFusdRaised: 2000,
		// rounds: [
		// 	{
		// 		status: 'active',
		// 		currency: Currencies.FLOW,
		// 		goal: 30000,
		// 		raised: 2000,
		// 		startDate: new Date(10 / 10 / 2020),
		// 		finishDate: new Date(10 / 10 / 2023),
		// 		distributed: false,
		// 		withdrawn: false
		// 	}
		// ]
	};
</script>

<Section>
	<Container>
		<div class="main-wrapper">
			<ProjectSidebarSection {daoData} />
			<div class="secondary-wrapper">
				{#if daoData.type === DaoType.Community}
					<CommunityProject {daoData} />
				{:else if daoData.type === DaoType.Financial}
					<FinancialProject {daoData} />
				{/if}
			</div>
		</div>
	</Container>
</Section>

<style type="scss">
	.main-wrapper {
		display: flex;
		overflow: hidden;
		max-height: 75vh;
		height: 100%;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1.3fr 2fr;
			gap: 4rem;
		}
	}
</style>
