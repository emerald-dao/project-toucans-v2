<script type="ts">
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DropDownHeading from '$lib/components/atoms/DropDownHeading.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: (FinancialDao | CommunityDao)[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	const userDaosNames = adminData.userDaos.map((dao) => dao.name);

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

<nav class="column-12 align-start">
	<div class="column-4">
		<img src={activeDaoData.logo} alt="DAO Logo" />
		{#if userDaosNames.length > 1}
			<DropDownHeading name="dao-headings" bind:value={$activeDaoStore} headings={userDaosNames}/>
		{:else}
			<h1 class="h3">{activeDaoData.name}</h1>
		{/if}
		<Label color="neutral" size="small">{activeDaoData.type} DAO</Label>
	</div>
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
			max-width: 180px;
			aspect-ratio: 1 / 1;
			object-fit: contain;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-3);
		}
	}
</style>
