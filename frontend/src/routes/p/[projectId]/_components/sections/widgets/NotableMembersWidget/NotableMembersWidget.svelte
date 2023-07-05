<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import Icon from '@iconify/svelte';
	import NotableMemberAvatar from './atoms/NotableMemberAvatar.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import { getAccountFromDiscordBatch } from '$flow/utils';

	export let daoData: DAOProject;

	$: fundersEntries = Object.entries(daoData.onChainData.funders);
	$: mainFunderEntries = fundersEntries
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 5);

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	$: holdersEntries = Object.entries(daoData.onChainData.balances);
	$: mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 5);

	let voterLeaderboard: { [key: string]: number } = {};

	for (const proposal of daoData.votes) {
		for (const voter of proposal.votes) {
			voterLeaderboard[voter.voter] = (voterLeaderboard[voter.voter] || 0) + 1;
		}
	}

	const mainVoters = Object.entries(voterLeaderboard)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 5);

	const mainVotersDiscordIds = mainVoters.map((voter) => voter[0]);
	const mainVotersAmountOfVotes = mainVoters.map((voter) => voter[1]);

	const mainVotersAddresses = getAccountFromDiscordBatch(mainVotersDiscordIds);
</script>

{#if mainFunderEntries.length > 0 || (daoData.generalInfo.token_symbol && holdersEntries.length > 0) || mainVoters.length > 0}
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
										<Currency amount={funder[1]} currency={daoData.onChainData.paymentCurrency} />
									</NotableMemberAvatar>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			{#if daoData.generalInfo.token_symbol && holdersEntries.length > 0}
				<div class="card prize-wrapper">
					<div class="column-4 align-center">
						<span class="small title">Project holders</span>
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
			{#if mainVoters.length > 0}
				{#await mainVotersAddresses then addresses}
					{#if addresses != null}
						<div class="card prize-wrapper">
							<div class="column-4 align-center">
								<span class="small title">Decision makers</span>
								<div class="avatars-wrapper">
									{#each Object.values(addresses) as voter, i}
										<div class={`member-${i + 1} center`}>
											<NotableMemberAvatar address={voter} position={i + 1}>
												<p class="xsmall">
													Has particpated in {mainVotersAmountOfVotes[i]} votations
												</p>
											</NotableMemberAvatar>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				{/await}
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
				grid-template-columns: repeat(3, 1fr);
			}

			.prize-wrapper {
				// background-color: var(--clr-background-secondary);
				border-radius: var(--radius-3);

				.avatars-wrapper {
					display: grid;
					grid-template-columns: repeat(2, auto);
					grid-template-rows: repeat(3, auto);
					place-content: center;
					gap: var(--space-4);
					grid-template-areas:
						'golden golden'
						'silver bronze'
						'fourth fifth';

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

					& > div {
						height: fit-content;
					}
				}
			}
		}
	}
</style>
