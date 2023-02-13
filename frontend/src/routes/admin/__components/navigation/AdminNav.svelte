<script type="ts">
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: (FinancialDao | CommunityDao)[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

<nav class="column-12 align-start">
	<div class="column-2">
		<img src={activeDaoData.logo} alt="DAO Logo" />
		<h1 class="h3">{activeDaoData.name}</h1>
		<Label size="small" color="tertiary">{`$${activeDaoData.token_symbol}`}</Label>
	</div>
	<select name="daos" id="daos" bind:value={$activeDaoStore}>
		{#each adminData.userDaos as dao, i}
			<option value={i}>{dao.name}</option>
		{/each}
	</select>
	<div class="column-10 align-start">
		<a href="/admin" class="sidebar-link">
			<Icon icon="tabler:chart-infographic" />
			Stats
		</a>
		{#if activeDaoData.type === DaoType.Financial}
			<a href="/admin/rounds" class="sidebar-link">
				<Icon icon="tabler:analyze" />
				Rounds
			</a>
		{/if}
		{#if activeDaoData.type === DaoType.Community}
			<a href="/admin/distribute" class="sidebar-link distribute-display">
				<Icon icon="tabler:arrows-maximize" />
				Distribute
			</a>
		{/if}
		<a href="/admin/info" class="sidebar-link">
			<Icon icon="tabler:bolt" />
			Edit Info
		</a>
	</div>
</nav>

<style type="scss">
	nav {
		padding-bottom: var(--space-5);
		border-bottom: 1px solid var(--clr-neutral-400);

		@include mq('medium') {
			border-bottom: none;
		}

		h1 {
			overflow-wrap: break-word;
			white-space: normal;
			max-width: 220px;
		}
	
		.distribute-display {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}
	
		img {
			max-width: 100%;
			aspect-ratio: 1 / 1;
			object-fit: contain;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-3);
		}
	}
</style>
