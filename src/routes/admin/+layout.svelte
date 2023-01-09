<script type="ts">
	import { financialDaoData } from '$lib/mock/financialDao';
	import { AdminNav } from './components';
	import { setContext } from 'svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { communityDaoData } from '$lib/mock/communityDao';

	// TODO: Get all data from the blockchain and share it with a context
	const daoData: FinancialDao | CommunityDao = communityDaoData;
	setContext<FinancialDao | CommunityDao>('dao-data', daoData);
</script>

<div class="section">
	<div class="container">
		<div class="main-wrapper">
			<AdminNav daoType={daoData.type} />
			<div class="content-wrapper">
				<slot />
			</div>
		</div>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 4fr;
			gap: var(--space-16);
		}
	}
</style>
