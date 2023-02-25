<script type="ts">
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import type { Distribution } from '$lib/types/distribution.interface';
	import Papa from 'papaparse';
	import { Button, DropZone } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import { InputWrapper, Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import distributionSuite from '$lib/validations/distributionSuite';
	import type { Writable } from 'svelte/store';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: FinancialDao[] | CommunityDao[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

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
	export let addToStaging: (validForm: boolean) => void;
</script>

<Tabs>
	<TabList>
		<Tab>
			<span class="xsmall"> Manual distribution </span>
		</Tab>
		<Tab><span class="xsmall">Bulk distribution (CSV)</span></Tab>
	</TabList>
	<TabPanel>
		<form
			id="dist-form"
			on:submit|preventDefault={() => addToStaging(res.isValid())}
			autocomplete="off"
			class="wrapper"
		>
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
				iconText={`$${activeDaoData.token_symbol}`}
				errors={res.getErrors('amount')}
				isValid={res.isValid('amount')}
			>
				<input name="amount" type="text" bind:value={formDist.tokens} on:input={handleChange} />
			</InputWrapper>
			<Button
				form="dist-form"
				type="ghost"
				color="neutral"
				width="full-width"
				state={res.isValid() ? 'active' : 'disabled'}
				>Add <Icon icon="tabler:arrow-narrow-right" /></Button
			>
		</form>
	</TabPanel>
	<TabPanel>
		<div class="wrapper">
			<DropZone
				name="distribution-csv"
				accept={['text/csv']}
				bind:bindValue={csvFile}
				maxAmountOfFiles={1}
			/>
		</div>
		<Button
			form="dist-form"
			type="ghost"
			color="neutral"
			width="full-width"
			state={csvDist.length > 0 ? 'active' : 'disabled'}
			>Add <Icon icon="tabler:arrow-narrow-right" /></Button
		>
	</TabPanel>
</Tabs>

<style types="ts">
	.wrapper,
	form {
		margin-block: var(--space-4);
	}
</style>
