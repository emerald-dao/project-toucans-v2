<script type="ts">
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import type { Distribution } from '$lib/types/distribution.interface';
	import Papa from 'papaparse';
	import { Button, DropZone } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import distributionSuite from '$lib/validations/distributionSuite';

	const daoData: FullDaoProject = getContext('dao-data');

	let csvFile: File[] = [];

	const parseAndSaveCsv = () => {
		if (csvFile.length > 0) {
			let parsedCSV = Papa.parse(csvFile[0], {
				download: true,
				header: true, // gives us an array of objects
				dynamicTyping: true,
				complete: ({ data }) => (csvDist = data)
			});
		}
	};

	const emptyCsv = () => {
		csvDist = [];
	};

	$: if (csvFile.length > 0) parseAndSaveCsv();
	$: if (csvFile.length === 0) emptyCsv();

	let res = distributionSuite.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address exists in the blockchain'];

	const handleChange = (input: Event) => {
		res = distributionSuite(formDist, input.target.name);

		if (input.target.name === 'address') {
			addressPending = true;
		}

		res.done((result) => {
			res = result;
			addressPending = false;
		});
	};

	export let formDist: Distribution;
	export let csvDist: Distribution[];
	export let addToStaging: () => void;
</script>

<form
	id="dist-form"
	on:submit|preventDefault={() => addToStaging(res.isValid())}
	autocomplete="off"
	class="wrapper"
>
	<h4>Manual Add</h4>
	<InputWrapper
		name="address"
		label="Address"
		pending={addressPending}
		pendingMessage={addressPendingMessage}
		errors={res.getErrors('address')}
		isValid={res.isValid('address')}
	>
		<input
			name="address"
			type="text"
			maxlength="18"
			bind:value={formDist.account}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="amount"
		label="Amount"
		iconText={`$${daoData.tokenName}`}
		errors={res.getErrors('amount')}
		isValid={res.isValid('amount')}
	>
		<input name="amount" type="number" bind:value={formDist.tokens} on:input={handleChange} />
	</InputWrapper>
</form>
<div class="wrapper">
	<h4>Drop CSV</h4>
	<DropZone
		name="distribution-csv"
		accept="text/csv"
		bind:bindValue={csvFile}
		maxAmountOfFiles={1}
	/>
</div>
<Button
	form="dist-form"
	type="ghost"
	color="neutral"
	size="full-width"
	state={res.isValid() || csvDist.length > 0 ? 'active' : 'disabled'}
	>Add <Icon icon="tabler:arrow-narrow-right" /></Button
>

<style types="ts">
	h4 {
		font-size: var(--fs-400);
		margin-bottom: 1em;
	}

	.wrapper {
		margin-bottom: 2rem;
	}
</style>
