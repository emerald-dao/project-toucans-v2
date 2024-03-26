<script lang="ts">
	import { Currency, Label } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let project: DaoRankingData;
	export let number: number;
</script>

<tr>
	<th scope="row" class="left-align fit-content soft-text">{number + 1}</th>
	<td class="left-align">
		<Label size="xx-small" hasBorder={false} color="tertiary">
			{project.projects.token_symbol}
		</Label>
	</td>
	<td>
		<a href={`/p/${project.project_id}`} class="row-2 align-center left-align fit-content">
			<img
				src={project.projects.logo}
				on:error={(e) => handleLogoImgError(e)}
				alt={`${project.projects.name} logo`}
				class="logo"
			/>
			{project.projects.name}
		</a>
	</td>
	<td>
		{#if project.price}
			{#if project.price < .01}
				<Currency
					amount={project.price}
					color="heading"
					fontSize="var(--font-size-0)"
					moneyPrefix={true}
					decimalNumbers={5}
				/>
			{:else}
				<Currency
					amount={project.price}
					color="heading"
					fontSize="var(--font-size-0)"
					moneyPrefix={true}
					decimalNumbers={2}
				/>
			{/if}
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{#if project.price}
			<Currency
				amount={Math.round(project.price * project.total_supply * 100) / 100}
				color="heading"
				fontSize="var(--font-size-0)"
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
				fontSize="var(--font-size-0)"
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
				fontSize="var(--font-size-0)"
				moneyPrefix={true}
			/>
		{:else}
			N/A
		{/if}
	</td>
	<td>
		<Currency
			amount={project.total_supply}
			currency={project.projects.token_symbol}
			color="heading"
			fontSize="var(--font-size-0)"
		/>
	</td>
	<td>
		{#if project.max_supply}
			<Currency
				amount={project.max_supply}
				currency={project.projects.token_symbol}
				color="heading"
				fontSize="var(--font-size-0)"
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
		margin-block: var(--space-10);

		th,
		td {
			text-align: right;
			color: var(--clr-heading-main);
			font-size: var(--font-size-0);
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
