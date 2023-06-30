<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import LeaderboardListElement from '../../../leaderboards/atoms/LeaderboardListElement.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getFindProfilesBatch } from '$flow/utils';
	import getRandomUserNumber from '../../../../../routes/u/[address]/_features/userNames/getRandomUserNumber';
	import RANDOM_USERS from '../../../../../routes/u/[address]/_features/userNames/randomUsers';
	import type { Profile } from '$lib/types/common/profile.interface';

	export let daoData: DAOProject;

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	const holdersEntries = Object.entries(daoData.onChainData.balances);
	const getMainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 6);

	const mainHoldersEntries = getMainHoldersEntries;

	const fetchProfiles = async () => {
		let profiles: Profile[] = [];

		const addressList = mainHoldersEntries.map((entry) => entry[0]);

		const findProfiles: {
			[address: string]: Profile;
		} = await getFindProfilesBatch(addressList);

		mainHoldersEntries.map((entry) => {
			const profile = findProfiles[entry[0]];

			if (profile) {
				profiles.push(profile);
			} else {
				const profileNumber = getRandomUserNumber(entry[0], RANDOM_USERS.length);

				profiles.push({
					address: entry[0],
					...RANDOM_USERS[profileNumber]
				});
			}
		});

		return profiles;
	};
</script>

<div>
	{#if daoData.generalInfo.token_symbol}
		{#await fetchProfiles() then profiles}
			{#each profiles as profile, i}
				<LeaderboardListElement rank={i + 1} {profile}>
					<Currency
						amount={daoData.onChainData.balances[profile.address]}
						currency={daoData.generalInfo.token_symbol}
						color="heading"
					/>
				</LeaderboardListElement>
			{/each}
		{/await}
	{/if}
</div>
