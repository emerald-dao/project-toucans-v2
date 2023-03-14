<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { page } from '$app/stores';
	import { Currency, Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DropDownHeading from './atoms/DropDownHeading.svelte';
	import CopyToClipboard from '$components/atoms/CopyToClipboard.svelte';
	import dappInfo from '$lib/config/config';
	import AlertNumber from '$components/atoms/AlertNumber.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

	const copyToClipboard = () => {
		const app = new CopyToClipboard({
			target: document.getElementById('clipboard') as Element,
			props: { name: `https://${dappInfo.url}/discover/${activeDaoData.generalInfo.project_id}` }
		});
		app.$destroy();
	};
</script>

<nav>
	<div class="column-10">
		<div class="row-3 align-center">
			<img src={activeDaoData.generalInfo.logo} alt="DAO Logo" />
			<DropDownHeading bind:activeDao={$activeDaoStore} userDaos={adminData.userDaos}>
				<div id="clipboard" />
				<div class="top-dropdown-wapper" on:click={copyToClipboard} slot="top" on:keydown>
					<Label color="neutral" size="small">
						<div class="row-6 header-link align-center">
							<span class="row-1 align-center">
								{activeDaoData.generalInfo.project_id}
							</span>
							<Icon icon="tabler:copy" />
						</div>
					</Label>
				</div>
				<div class="bottom-dropdown-wapper" slot="bottom">
					<a class="header-link row-2 align-center" href="/dao-generator">
						<Icon icon="tabler:square-rounded-plus" width="1.1rem" />
						Add new DAO
					</a>
				</div>
			</DropDownHeading>
		</div>
		<div class="column-8">
			<a href="/admin" class="sidebar-link" class:active={$page.url.pathname === '/admin'}>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:home" />
				</div>
				Home
			</a>
			<a
				href="/admin/rounds"
				class="sidebar-link"
				class:active={$page.url.pathname.includes('rounds')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:pig-money" />
				</div>
				Rounds
			</a>
			{#if activeDaoData.onChainData.minting}
				<a
					href="/admin/mint"
					class="sidebar-link"
					class:active={$page.url.pathname.includes('mint')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:coin" />
					</div>
					Mint
				</a>
			{/if}
			<a
				href="/admin/withdraw"
				class="sidebar-link distribute-display"
				class:active={$page.url.pathname.includes('withdraw')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:outbound" />
				</div>
				Withdraw
			</a>
			<a
				href="/admin/actions"
				class="sidebar-link distribute-display"
				class:active={$page.url.pathname.includes('actions')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:layout-list" />
				</div>
				Actions Queue
				{#if Number(activeDaoData.onChainData.actions.length) > 0}
					<AlertNumber number={Number(activeDaoData.onChainData.actions.length)} />
				{/if}
			</a>
			<a
				href="/admin/multisig"
				class="sidebar-link distribute-display"
				class:active={$page.url.pathname.includes('multisig')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:signature" />
				</div>
				Multisig
			</a>
		</div>
	</div>
	<div class="column-6">
		<div class="treasury-wallet-card column-2">
			<div class="icon-wrapper">
				<Icon icon="tabler:wallet" />
			</div>
			<span class="xsmall row-1 align-center"> Treasury funds </span>
			<div class="column-1">
				{#each Object.entries(activeDaoData.onChainData.treasuryBalances) as [token, balance]}
					<Currency amount={Number(balance)} currency={token} color="heading" fontSize="1.1rem" />
				{/each}
			</div>
		</div>
		<a
			href="/admin/info"
			class="sidebar-link small"
			class:active={$page.url.pathname.includes('info')}
		>
			<div class="sidebar-link-icon ">
				<Icon icon="tabler:edit" />
			</div>
			Edit Info
		</a>
	</div>
</nav>

<style type="scss">
	nav {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-bottom: 1px solid var(--clr-neutral-400);
		padding-block: var(--space-10);

		@include mq('medium') {
			border-bottom: none;
			border-right: 0.5px var(--clr-border-primary) solid;
		}

		.distribute-display {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}

		.treasury-wallet-card {
			width: fit-content;
			padding: var(--space-4) var(--space-6);
			border-radius: var(--radius-1);
			background-color: var(--clr-background-secondary);
			position: relative;

			.icon-wrapper {
				position: absolute;
				left: -0.6em;
				top: -0.6em;
				border-radius: 50%;
				width: 2em;
				aspect-ratio: 1/1;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--clr-surface-primary);
				border: 0.5px solid var(--clr-border-primary);
			}
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
			max-width: 50px;
			aspect-ratio: 1 / 1;
			object-fit: cover;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-1);
		}

		.sidebar-link {
			font-size: var(--font-size-3);
			display: flex;

			.sidebar-link-icon {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			&.active > .sidebar-link-icon {
				color: var(--clr-tertiary-main);
			}

			&.small {
				font-size: var(--font-size-2);
			}
		}
	}
</style>
