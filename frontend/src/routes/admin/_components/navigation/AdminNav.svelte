<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { page } from '$app/stores';
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DropDownHeading from '$lib/components/atoms/DropDownHeading.svelte';
	import CopyToClipboard from '$components/atoms/CopyToClipboard.svelte';
	import dappInfo from '$lib/config/config';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosNames = adminData.userDaos.map((dao) => dao.generalInfo.name);

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

	const copyToClipboard = () => {
		const app = new CopyToClipboard({
			target: document.getElementById('clipboard') as Element,
			props: { name: `https://${dappInfo.url}/${activeDaoData.generalInfo.contract_name}` }
		});
		app.$destroy();
	};
</script>

<nav>
	<div class="column-10">
		<div class="row-3 align-center">
			<img src={activeDaoData.generalInfo.logo} alt="DAO Logo" />
			<DropDownHeading name="dao-headings" bind:value={$activeDaoStore} headings={userDaosNames}>
				<div id="clipboard" />
				<div class="top-dropdown-wapper" on:click={copyToClipboard} slot="top" on:keydown>
					<Label color="neutral" size="small">
						<div class="row-6 header-link align-center">
							<span class="row-1 align-center">
								{activeDaoData.generalInfo.contract_name}
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
		<div class="column-6">
			<a href="/admin" class="sidebar-link" class:active={$page.url.pathname === '/admin'}>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:chart-infographic" />
				</div>
				Stats
			</a>
			<a
				href="/admin/rounds"
				class="sidebar-link"
				class:active={$page.url.pathname.includes('rounds')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:analyze" />
				</div>
				Rounds
			</a>
			<a href="/admin/mint" class="sidebar-link" class:active={$page.url.pathname.includes('mint')}>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:coin" />
				</div>
				Mint
			</a>
			<a
				href="/admin/withdraw"
				class="sidebar-link distribute-display"
				class:active={$page.url.pathname.includes('withdraw')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:arrows-maximize" />
				</div>
				Withdraw
			</a>
		</div>
	</div>
	<a href="/admin/info" class="sidebar-link" class:active={$page.url.pathname.includes('info')}>
		<div class="sidebar-link-icon">
			<Icon icon="tabler:edit" />
		</div>
		Edit Info
	</a>
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
		}
	}
</style>
