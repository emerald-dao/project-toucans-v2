<script type="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import Papa from 'papaparse';
	import { Button, DropZone } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { InputWrapper, Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import fungibleTokenDistributionValidation from '../_validations/fungibleTokenDistributionValidation';
	import type { SuiteRunResult } from 'vest';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	export let formDist: Distribution;
	export let csvDist: Distribution[];
	export let activeCurrency: string;
	export let availableBalance: number | undefined | 'infinite';
	export let contractAddress: string | null;
	export let projectId: string;
	export let distStaging: Distribution[];

	let csvFile: File[] = [];

	const addToStaging = (validForm: boolean) => {
		if (validForm) {
			distStaging = [...distStaging, { ...formDist }, ...csvDist];

			resetForm();
			resetValidation();
		} else {
			distStaging = [...distStaging, ...csvDist];
		}
	};

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

	let res = fungibleTokenDistributionValidation.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address has currency vault...'];

	$: amountOfTokensInStaging = distStaging.reduce((acc, curr) => {
		return acc + Number(curr.amount);
	}, 0);

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = fungibleTokenDistributionValidation(
			formDist,
			target.name,
			availableBalance,
			amountOfTokensInStaging,
			contractAddress,
			projectId,
			activeCurrency
		);

		if (target.name === 'address') {
			addressPending = true;
		}

		(res as SuiteRunResult).done((result) => {
			res = result;
			addressPending = false;
		});
	};

	const resetValidation = () => {
		fungibleTokenDistributionValidation.reset();
		res = fungibleTokenDistributionValidation.get();
	};

	const resetForm = () => {
		formDist = {
			address: '',
			amount: ''
		};
	};

	$: if (activeCurrency) resetValidation();
</script>

<div in:fade|local={{ duration: 200 }} class="column-4">
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
				class="dist-form"
				on:submit|preventDefault={() => addToStaging(res.isValid())}
				autocomplete="off"
			>
				<div class="column">
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
					{#if res.isValid('address') && formDist.address}
						<div in:fly|local={{ duration: 400, y: -5 }} class="avatar-wrapper">
							<UserAvatar
								address={formDist.address}
								userLink={false}
								fontSize="var(--font-size-0)"
							/>
						</div>
					{/if}
				</div>
				<InputWrapper
					name="amount"
					label="Amount"
					iconText={`$${activeCurrency}`}
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
			<form
				id="dist-form"
				on:submit|preventDefault={() => addToStaging(res.isValid())}
				autocomplete="off"
				class="column-3"
			>
				<p class="xsmall margin-top">
					For an example CSV file, download <a href="/example-toucans-upload.csv">this</a>.
				</p>
				<DropZone
					name="distribution-csv"
					accept={['text/csv']}
					bind:bindValue={csvFile}
					maxAmountOfFiles={1}
				/>
				<Button
					form="dist-form"
					type="ghost"
					color="neutral"
					width="full-width"
					state={csvDist.length > 0 ? 'active' : 'disabled'}
					>Add <Icon icon="tabler:arrow-narrow-right" /></Button
				>
			</form>
		</TabPanel>
	</Tabs>
</div>

<style lang="scss">
	.margin-top {
		margin-top: 15px;
	}

	.dist-form {
		margin-block: var(--space-4);
	}

	.avatar-wrapper {
		margin-top: -0.8rem;
		margin-bottom: 1.2rem;
	}

	span {
		color: inherit;
	}
</style>
