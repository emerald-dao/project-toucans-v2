<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import type { FindProfile } from '@emerald-dao/component-library/models/user.interface';

	export let daoData: DAOProject;
	export let holders: { [address: string]: string };
	export let lpAddresses: string[];
	export let findProfiles: { [address: string]: FindProfile };

	let entries = Object.entries(holders);
	let sorted = entries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner)
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0));
	let buttonState: 'active' | 'loading' | 'done' = 'active';

	async function downloadCSV() {
		buttonState = 'loading';

		let csvContent = 'data:text/csv;charset=utf-8,';
		csvContent += 'address,find name,amount,notes\n';
		csvContent += sorted
			.map(([address, balance]) => {
				let row = address + ',' + (findProfiles[address]?.name || 'N/A') + ',' + balance;
				if (address == daoData.generalInfo.contract_address) {
					row += ',' + 'This is the DAO treasury address.';
				}
				if (lpAddresses.includes(address)) {
					row += ',' + 'This is a liquidity pool.';
				}
				return row;
			})
			.join('\n');
		var encodedUri = encodeURI(csvContent);
		var downloadLink = document.createElement('a');
		downloadLink.href = encodedUri;
		downloadLink.download = daoData.generalInfo.project_id + '_Holders.csv';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		buttonState = 'done';
	}
</script>

<div>
	<Button state={buttonState} type="ghost" color="neutral" size="x-small" on:click={downloadCSV}>
		Download CSV
	</Button>
</div>

<style lang="scss">
	div {
		margin-bottom: var(--space-2);
	}
</style>
