<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import { page } from '$app/stores';
	import { Label, AlertNumber } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DropDownHeading from './atoms/DropDownHeading.svelte';
	import CopyToClipboard from '$components/atoms/CopyToClipboard.svelte';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { network } from '$flow/config';

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;

	let copied = false;
	const copyToClipboard = () => {
		const app = new CopyToClipboard({
			target: document.getElementById('clipboard') as Element,
			props: { name: `${$page.url.origin}/p/${activeDaoData.generalInfo.project_id}` }
		});

		copied = true;

		setTimeout(() => {
			copied = false;
		}, 2000);

		app.$destroy();
	};
</script>

<nav>
	<div class="column-10">
		<div class="row-3 align-center">
			<img
				src={activeDaoData.generalInfo.logo}
				on:error={(e) => handleLogoImgError(e)}
				alt="DAO Logo"
			/>
			<DropDownHeading activeDao={activeDaoData} userDaos={adminData.otherDaos}>
				<div id="clipboard" />
				<div class="top-dropdown-wapper" on:click={copyToClipboard} slot="top" on:keydown>
					<Label color="neutral" size="small">
						<div class="row-6 header-link align-center">
							<span class="row-1 align-center">
								{activeDaoData.generalInfo.project_id}
							</span>
							{#if copied}
								<div in:fly|local={{ x: 10, duration: 300 }} class="row align-center">
									<Icon icon="tabler:check" color="var(--clr-primary-main)" />
								</div>
							{:else}
								<div in:fly|local={{ x: 10, duration: 300 }} class="row align-center">
									<Icon icon="tabler:copy" />
								</div>
							{/if}
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
		<div class="column-5">
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}`}
				class="sidebar-link"
				class:active={$page.url.pathname === `/admin/${activeDaoData.generalInfo.project_id}`}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:home" />
				</div>
				Home
			</a>
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/actions`}
				class="sidebar-link"
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
			{#if activeDaoData.hasToken}
				<a
					href={`/admin/${activeDaoData.generalInfo.project_id}/rounds`}
					class="sidebar-link"
					class:active={$page.url.pathname.includes('rounds')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:pig-money" />
					</div>
					Rounds
				</a>
			{/if}
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/multisig`}
				class="sidebar-link"
				class:active={$page.url.pathname.includes('multisig')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:signature" />
				</div>
				Multisig
			</a>
			{#if activeDaoData.hasToken}
				<a
					href={`/admin/${activeDaoData.generalInfo.project_id}/overflow`}
					class="sidebar-link"
					class:active={$page.url.pathname.includes('overflow')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:moneybag" />
					</div>
					Overflow
				</a>
			{/if}
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/nft-collections`}
				class="sidebar-link"
				class:active={$page.url.pathname.includes('nft-collections')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:hexagon" />
				</div>
				NFT Collections
			</a>
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/voting`}
				class="sidebar-link"
				class:active={$page.url.pathname.includes('voting')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="lucide:vote" />
				</div>
				Voting Rounds
			</a>
			<span class="sidebar-divider">Funds management</span>
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/withdraw`}
				class="sidebar-link"
				class:active={$page.url.pathname.includes('withdraw')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:outbound" />
				</div>
				Distribute
			</a>
			{#if activeDaoData.hasToken && activeDaoData.onChainData.minting}
				<a
					href={`/admin/${activeDaoData.generalInfo.project_id}/mint`}
					class="sidebar-link"
					class:active={$page.url.pathname.includes('mint')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:coin" />
					</div>
					Mint
				</a>
			{/if}
			{#if activeDaoData.hasToken}
				<a
					href={`/admin/${activeDaoData.generalInfo.project_id}/lock`}
					class="sidebar-link"
					class:active={$page.url.pathname.includes('lock')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:lock-dollar" />
					</div>
					Lock
				</a>
			{/if}
			<a
				href={`/admin/${activeDaoData.generalInfo.project_id}/burn`}
				class="sidebar-link"
				class:active={$page.url.pathname.includes('burn')}
			>
				<div class="sidebar-link-icon">
					<Icon icon="tabler:flame" />
				</div>
				Burn
			</a>
			{#if network === 'mainnet'}
				<a
					href={`/admin/${activeDaoData.generalInfo.project_id}/staking`}
					class="sidebar-link"
					class:active={$page.url.pathname.includes('staking')}
				>
					<div class="sidebar-link-icon">
						<Icon icon="tabler:coins" />
					</div>
					Staking
				</a>
			{/if}
		</div>
	</div>
	<a
		href={`/admin/${activeDaoData.generalInfo.project_id}/info`}
		class="sidebar-link small"
		class:active={$page.url.pathname.includes('info')}
	>
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
		padding-inline: 5vw var(--space-5);
		padding-block: var(--space-10);

		@include mq('medium') {
			border-bottom: none;
			border-right: 0.5px var(--clr-border-primary) solid;
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

		.sidebar-divider {
			border-bottom: 1px solid var(--clr-surface-primary);
			font-size: var(--font-size-1);
			color: var(--clr-text-off);
			margin-top: var(--space-3);
			margin-bottom: -4px;
			padding-bottom: var(--space-1);
			padding-inline: var(--space-1);
		}

		.sidebar-link {
			font-size: var(--font-size-2);
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
