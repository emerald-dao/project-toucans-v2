<script type="ts">
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DropDownHeading from '$lib/components/atoms/DropDownHeading.svelte';
	import CopyToClipboard from '$components/atoms/CopyToClipboard.svelte';
	import dappInfo from '$lib/config/config';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: (FinancialDao | CommunityDao)[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosNames = adminData.userDaos.map((dao) => dao.name);

	$: activeDaoData = adminData.userDaos[$activeDaoStore];	

	const copyToClipboard = () => {
		const app = new CopyToClipboard({
			target: document.getElementById('clipboard') as Element,
			props: { name: `https://${dappInfo.url}/${activeDaoData.contract_name}` },
		});
		app.$destroy();
	}
</script>

<nav class="column-12 align-start">
	<div class="column-4">
		<img src={activeDaoData.logo} alt="DAO Logo" />
		<DropDownHeading name="dao-headings" bind:value={$activeDaoStore} headings={userDaosNames}>
			<div class="top-dropdown-wapper" on:click={copyToClipboard} slot="top">
				<Label color="neutral" size="small">
					<div class="row-6 header-link align-center">
						<span class="row-1 align-center">
							{activeDaoData.contract_name}
						</span>
						<Icon icon="tabler:copy" />
					</div>
				</Label>
			</div>
			<div class="bottom-dropdown-wapper" slot="bottom">
				<a class="header-link row-2 align-center" href="/dao-generator">
					<Icon icon="tabler:square-rounded-plus" width="1.1rem"/>
					Add new DAO
				</a>
			</div>
		</DropDownHeading>
		<Label color="tertiary" size="small">{activeDaoData.type} DAO</Label>
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
	<div id="clipboard"/>
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

		.contract-name {
			font-size: var(--font-size-0);
			color: var(--clr-text-off);
		}

		.top-dropdown-wapper {
			cursor: pointer;
			padding-bottom: var(--space-3);
			border-bottom: 1px solid var(--clr-surface-secondary);
			width: 100%;
		}

		.bottom-dropdown-wapper {
			padding-top: var(--space-4);
			width: 100%;
			border-top: 1px solid var(--clr-surface-secondary);
		}

		img {
			max-width: 160px;
			aspect-ratio: 1 / 1;
			object-fit: contain;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-3);
		}
	}
</style>
