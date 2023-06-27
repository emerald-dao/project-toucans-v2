<script lang="ts">
	import { Currency, Label } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import dappInfo from '$lib/config/config';

	export let project: DaoRankingData;
	export let number: number;
</script>

<tr>
	<th scope="row" class="left-align fit-content soft-text">{number + 1}</th>
	<td class="left-align">
		<Label size="xx-small" hasBorder={false} color="tertiary">
			{project.token_symbol}
		</Label>
	</td>
	<td>
		<a href={`/p/${project.project_id}`} class="row-2 align-center left-align fit-content">
			<img src={project.logo} alt={`${project.name} logo`} class="logo" />
			{project.name}
		</a>
	</td>
	<td>
		{#if project.price}
			<Currency
				amount={project.price}
				color="heading"
				fontSize="var(--font-size-1)"
				moneyPrefix={true}
				decimalNumbers={2}
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{#if project.price}
			<Currency
				amount={Math.round(project.price * project.total_supply * 100) / 100}
				color="heading"
				fontSize="var(--font-size-1)"
				moneyPrefix={true}
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{#if project.volume_24h}
			<Currency
				amount={project.volume_24h}
				color="heading"
				fontSize="var(--font-size-1)"
				moneyPrefix={true}
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{#if project.tvl}
			<Currency
				amount={project.tvl}
				color="heading"
				fontSize="var(--font-size-1)"
				moneyPrefix={true}
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		<Currency
			amount={project.total_supply}
			currency={project.token_symbol}
			color="heading"
			fontSize="var(--font-size-1)"
		/>
	</td>
	<td>
		{#if project.max_supply}
			<Currency
				amount={project.max_supply}
				currency={project.token_symbol}
				color="heading"
				fontSize="var(--font-size-1)"
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{project.num_holders}
	</td>
</tr>

<style type="scss">
	tr {
		margin-block: var(--spacce-10);

		th,
		td {
			text-align: right;
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
		}

		a {
			color: var(--clr-heading-main);
			text-decoration: none;
		}

		.fit-content {
			width: fit-content;
		}

		.soft-text {
			color: var(--clr-text-off);
		}

		.left-align {
			text-align: left;
		}

		.logo {
			width: 22px;
			height: 22px;
			border-radius: 50%;
		}
	}
</style>
