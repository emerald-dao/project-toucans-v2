<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import Icon from '@iconify/svelte';
	import NotableMemberAvatar from './atoms/NotableMemberAvatar.svelte';
	import { Currency } from '@emerald-dao/component-library';

	export let daoData: DAOProject;

	$: fundersEntries = Object.entries(daoData.funding.funders);
	$: mainFunderEntries = fundersEntries
		.sort((a, b) =>
			Number(a[1].amount) < Number(b[1].amount)
				? 1
				: Number(a[1].amount) > Number(b[1].amount)
				? -1
				: 0
		)
		.slice(0, 9);

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	$: holdersEntries = daoData.hasToken ? Object.entries(daoData.onChainData.balances) : [];
	$: mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 9);
</script>

{#if mainFunderEntries.length > 0 || (daoData.hasToken && holdersEntries != undefined && holdersEntries.length > 0)}
	<div class="main-wrapper">
		<span class="title">
			<Icon icon="tabler:medal" />
			Notable members
		</span>
		<div class="secondary-wrapper">
			{#if mainFunderEntries.length > 0}
				<div class="card prize-wrapper">
					<div class="column-4 align-center">
						<span class="small title">Project investors</span>
						<div class="avatars-wrapper">
							{#each mainFunderEntries as funder, i}
								<div class={`member-${i + 1} center`}>
									<NotableMemberAvatar address={funder[0]} position={i + 1}>
										<span class="xsmall"> Total invested </span>
										<Currency amount={funder[1].amount} moneyPrefix={true} decimalNumbers={2} />
									</NotableMemberAvatar>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			{#if daoData.generalInfo.token_symbol && holdersEntries != undefined && holdersEntries.length > 0}
				<div class="card prize-wrapper">
					<div class="column-4 align-center">
						<span class="small title">Token holders</span>
						<div class="avatars-wrapper">
							{#each mainHoldersEntries as holder, i}
								<div class={`member-${i + 1} center`}>
									<NotableMemberAvatar address={holder[0]} position={i + 1}>
										<span class="xsmall"> Total held </span>
										<Currency amount={holder[1]} currency={daoData.generalInfo.token_symbol} />
									</NotableMemberAvatar>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		.title {
			font-size: var(--font-size-1);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}

		.secondary-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-5);

			@include mq('small') {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
			}

			.prize-wrapper {
				border-radius: var(--radius-3);

				.avatars-wrapper {
					display: grid;
					grid-template-columns: repeat(6, auto);
					place-content: center;
					gap: var(--space-4);
					grid-template-areas:
						'golden golden golden golden golden golden'
						'silver silver silver bronze bronze bronze'
						'fourth fourth fifth fifth sixth sixth'
						'seventh seventh eighth eighth ninth ninth';

					.member-1 {
						grid-area: golden;
					}

					.member-2 {
						grid-area: silver;
					}

					.member-3 {
						grid-area: bronze;
					}

					.member-4 {
						grid-area: fourth;
					}

					.member-5 {
						grid-area: fifth;
					}

					.member-6 {
						grid-area: sixth;
					}

					.member-7 {
						grid-area: seventh;
					}

					.member-8 {
						grid-area: eighth;
					}

					.member-9 {
						grid-area: ninth;
					}

					& > div {
						height: fit-content;
					}
				}
			}
		}
	}
</style>
