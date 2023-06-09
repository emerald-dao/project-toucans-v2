<script lang="ts">
	import { fly } from 'svelte/transition';
	import EventsList from '$components/dao-data-blocks/events/EventsList.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { mockDaoData } from './mockdata';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const selectedVaultStore: Writable<number> = getContext('selectedVault');

	const handleCloseVault = () => {
		selectedVaultStore.set(0);
	};

	const handleNextVault = () => {
		selectedVaultStore.update((value) => value + 1);
	};

	const handlePrevVault = () => {
		selectedVaultStore.update((value) => value - 1);
	};
</script>

<div class="main-wrapper column-10" transition:fly|local={{ x: 400, duration: 800 }}>
	<div class="close-button header-link" on:click={handleCloseVault}>
		<Icon icon="tabler:x" />
	</div>
	<div class="content-wrapper">
		<div class="card-primary">
			<div class="column-6">
				<div class="column-2">
					<h3>
						<Icon icon="tabler:moneybag" />
						User vault
					</h3>
					<div class="row-2 align-center">
						<img src="/ec-logo.png" alt="Emerald City Logo" class="logo" />
						<h4 class="w-medium">Emerald City DAO</h4>
					</div>
				</div>
				<div class="row-5 align-end">
					<Currency
						amount={300.0}
						currency="EMD"
						fontSize="var(--font-size-6)"
						decimalNumbers={2}
						color="heading"
					/>
					<Currency
						amount={786.0}
						moneyPrefix={true}
						fontSize="var(--font-size-3)"
						decimalNumbers={2}
					/>
				</div>
			</div>
			<div class="column-space-between">
				<div class="header-link" on:click={handlePrevVault}>
					<Icon icon="tabler:arrow-up" />
				</div>
				<div class="header-link" on:click={handleNextVault}>
					<Icon icon="tabler:arrow-down" />
				</div>
			</div>
		</div>
		<div class="events-wrapper">
			<EventsList daoData={mockDaoData} />
		</div>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		position: fixed;
		right: 0;
		background-color: var(--clr-background-secondary);
		height: 100%;
		min-width: 50vw;

		.content-wrapper {
			padding: var(--space-14);
			display: flex;
			flex-direction: column;
			gap: var(--space-6);
			flex: 1;

			.card-primary {
				border-color: var(--clr-neutral-badge);
				background: linear-gradient(
						to right,
						rgba(18, 18, 18, 0.97),
						rgba(18, 18, 18, 1),
						rgba(18, 18, 18, 0.98),
						rgba(18, 18, 18, 0.9)
					),
					url(/toucans-illustration.png);
				background-size: cover;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				h3 {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: var(--space-1);
					color: var(--clr-text-main);
					font-size: var(--font-size-3);
				}

				.logo {
					width: 50px;
					height: 50px;
				}

				h4 {
					font-size: var(--font-size-5);
				}
			}

			.events-wrapper {
				padding-inline: var(--space-6);
			}
		}

		.close-button {
			position: absolute;
			left: 20px;
			top: 20px;
		}
	}
</style>
