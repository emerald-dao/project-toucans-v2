<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import Papa from 'papaparse';
	import { Button, DropZone } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import { InputWrapper, Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import validationSuite from './validation';
	import type { SuiteRunResult } from 'vest';
	import type { ECurrencies } from '$lib/types/common/enums';

	export let formDist: Distribution;
	export let csvDist: Distribution[];
	export let currencyToDistribute: ECurrencies | string;
	export let availableBalance: number | undefined;
	export let addToStaging: (validForm: boolean) => void;
	export let projectOwner: string;
	export let projectId: string;

	let csvFile: File[] = [];

	const parseAndSaveCsv = () => {
		if (csvFile.length > 0) {
			let parsedCSV = Papa.parse(csvFile[0], {
				download: true,
				header: true, // gives us an array of objects
				dynamicTyping: true,
				complete: ({ data }) => (csvDist = data as Distribution[])
			});
		}
	};

	const emptyCsv = () => {
		csvDist = [];
	};

	$: if (csvFile.length > 0) parseAndSaveCsv();
	$: if (csvFile.length === 0) emptyCsv();

	let res = validationSuite.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address exists in the blockchain'];

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;
		res = validationSuite(
			formDist,
			target.name,
			availableBalance,
			projectOwner,
			projectId,
			currencyToDistribute
		);

		if (target.name === 'address') {
			addressPending = true;
		}

		(res as SuiteRunResult).done((result) => {
			res = result;
			addressPending = false;
		});
	};
</script>

<div transition:fly|local={{ duration: 200, y: 30 }}>
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
						bind:value={formDist.address}
						on:input={handleChange}
					/>
				</InputWrapper>
				<InputWrapper
					name="amount"
					label="Amount"
					iconText={`$${currencyToDistribute}`}
					errors={res.getErrors('amount')}
					isValid={res.isValid('amount')}
				>
					<input name="amount" type="text" bind:value={formDist.amount} on:input={handleChange} />
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
</div>

<style lang="scss">
	.wrapper,
	form {
		margin-block: var(--space-4);
	}

	span {
		color: inherit;
	}
</style>
