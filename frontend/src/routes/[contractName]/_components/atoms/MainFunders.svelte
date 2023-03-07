<script type="ts">
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import { Currency } from '@emerald-dao/component-library';
	import { ECurrencies } from '$lib/types/common/enums';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	const getFunders = (actions: DaoEvent[]) => {
		const funders = actions.reduce(
			(
				acc: {
					[key: string]: number;
				},
				action
			) => {
				if (action.type === 'Purchase') {
					if (acc[action.by]) {
						acc[action.by] += Number(action.amount);
					} else {
						acc[action.by] = Number(action.amount);
					}
				}
				return acc;
			},
			{}
		);

		const fundersArray = Object.keys(funders).map((funder) => {
			return {
				name: funder,
				amount: funders[funder]
			};
		});

		return fundersArray.sort((a, b) => b.amount - a.amount);
	};

	const mainFunders = daoData.mainFunders;
</script>

<div class="column-2 align-start">
	{#each Object.entries(mainFunders) as funder}
		<div class="activity-wrapper">
			<div class="row-3 align-center">
				<img src="/avatar-2.png" alt="avatar logo" />
				<span class="funder-name">{funder.name}</span>
			</div>
			<Currency
				amount={Number(funder.amount)}
				currency={Currencies.FLOW}
				color="heading"
				fontSize="0.85rem"
			/>
		</div>
	{/each}
</div>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-border-primary);

		img {
			width: 30px;
			border-radius: 100%;
			aspect-ratio: 1/1;
		}

		.funder-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
		}
	}
</style>
