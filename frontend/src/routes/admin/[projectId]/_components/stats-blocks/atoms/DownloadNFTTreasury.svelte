<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import type { DonateNFTsEvent } from '$lib/types/dao-project/dao-event/events/donate-nfts.interface';
	import { Button } from '@emerald-dao/component-library';

	export let projectId: string;
	export let selectedCollection: string;
	export let NFTs: Nft[];
	// in ascending order
	export let events: DonateNFTsEvent[];
	let buttonState: 'active' | 'loading' | 'done' = 'active';

	async function downloadCSV() {
		if (selectedCollection != 'NFLAllDay') return;
		buttonState = 'loading';
		let uuidsMap: { [uuid: string]: { donatedBy: string; txId: string; time: string } } = {};
		for (let i = 0; i < events.length; i++) {
			let event = events[i];
			if (event.data.uuids) {
				for (let j = 0; j < event.data.uuids.length; j++) {
					uuidsMap[event.data.uuids[j]] = {
						donatedBy: event.data.by,
						txId: event.transaction_id,
						time: event.timestamp
					};
				}
			}
		}

		let csvContent = 'data:text/csv;charset=utf-8,';
		csvContent += 'name,serial,team,tier,set,series,donated by,time,transaction id\n';
		csvContent += NFTs.map((nft) => {
			let name =
				nft.traits && nft.traits['playerFirstName'] && nft.traits['playerLastName']
					? nft.traits['playerFirstName'] + ' ' + nft.traits['playerLastName']
					: nft.name;
			let { donatedBy, txId, time } = uuidsMap[nft.uuid]
				? {
						donatedBy: uuidsMap[nft.uuid].donatedBy,
						txId: uuidsMap[nft.uuid].txId,
						time: uuidsMap[nft.uuid].time
				  }
				: { donatedBy: 'N/A', txId: 'N/A', time: 'N/A' };
			return (
				name +
				',' +
				nft.serial +
				',' +
				nft.traits['teamName'] +
				',' +
				nft.traits['editionTier'] +
				',' +
				nft.traits['setName'] +
				',' +
				nft.traits['seriesName'] +
				',' +
				donatedBy +
				',' +
				time +
				',' +
				txId
			);
		}).join('\n');
		var encodedUri = encodeURI(csvContent);
		var downloadLink = document.createElement('a');
		downloadLink.href = encodedUri;
		downloadLink.download = projectId + '_NFLAllDay_Treasury.csv';
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
