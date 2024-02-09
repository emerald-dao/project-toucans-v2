<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import type { FindProfile } from '@emerald-dao/component-library/models/user.interface';

	export let projectId: string;
	export let funders: { [address: string]: { amount: number; num_nfts: number } };
	export let findProfiles: { [address: string]: FindProfile };
	let entries = Object.entries(funders);
	let sorted = entries.sort((a, b) =>
		Number(a[1].amount) < Number(b[1].amount)
			? 1
			: Number(a[1].amount) > Number(b[1].amount)
			? -1
			: 0
	);
	let buttonState: 'active' | 'loading' | 'done' = 'active';

	async function downloadCSV() {
		buttonState = 'loading';

		let csvContent = 'data:text/csv;charset=utf-8,';
		csvContent += 'address,find name,amount\n';
		csvContent += sorted
			.map(([address, { amount }]) => {
				return address + ',' + (findProfiles[address]?.name || 'N/A') + ',' + amount;
			})
			.join('\n');
		var encodedUri = encodeURI(csvContent);
		var downloadLink = document.createElement('a');
		downloadLink.href = encodedUri;
		downloadLink.download = projectId + '_Funders.csv';
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
