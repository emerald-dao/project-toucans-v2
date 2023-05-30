<script type="ts">
	import { Button, Modal, getModal, InputWrapper } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import RoundDatesPicker from '$lib/features/round-generator/components/atoms/RoundDatesPicker.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import validationSuite from '../validation/validation';
	import submitRoundChanges, { type RoundChangesData } from '../functions/submitRoundChanges';

	export let round: FundingCycle;

	$: adminData = getContext('admin-data') as {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	};

	$: activeDao = adminData.activeDao;
	$: userDaos = adminData.userDaos;

	$: issuanceRate = Number(round.details.issuanceRate);
	$: fundingTarget = Number(round.details.fundingTarget);

	let formData: RoundChangesData = {
		issuanceRate: 0,
		fundingTarget: 0,
		startDate: '0',
		endDate: '0'
	};

	onMount(() => {
		formData.issuanceRate = issuanceRate;
		formData.fundingTarget = fundingTarget;
		formData.startDate = round.details.timeframe.startTime;
		formData.endDate = round.details.timeframe.endTime || '0';
	});

	const id = `edit-round-${round.details.cycleId}`;

	const handleChange = (input: Event | CustomEvent) => {
		const target = input.target ?? (input as CustomEvent).detail.target;

		res = validationSuite(formData, target.name);
	};

	let res = validationSuite.get();

	$: validChanges =
		res.isValid('issuance-rate') &&
		res.isValid('funding-target') &&
		(formData.issuanceRate !== issuanceRate || formData.fundingTarget !== fundingTarget);
</script>

<div
	class="header-link row align-center"
	on:click={() => {
		getModal(id).open();
	}}
	on:keydown
>
	<Icon icon="tabler:edit" />
</div>

<Modal {id}>
	<div class="main-wrapper column-7">
		<h4 class="h5">Edit funding round</h4>
		<div class="content-wrapper">
			<RoundDatesPicker
				rounds={$userDaos[$activeDao].onChainData.fundingCycles}
				startDate={round.details.timeframe.startTime}
				endDate={round.details.timeframe.endTime || ''}
				infiniteDuration={round.details.timeframe.endTime === null}
				minStartTimePlus5Minutes={new Date(
					Number(round.details.timeframe.startTime) * 1000 + 300000
				)}
			/>
			<div class="column-1">
				<label for="issuance-rate"
					>Issuance rate <em
						>~ Current rate {$userDaos[$activeDao].generalInfo.token_symbol} {issuanceRate}</em
					></label
				>
				<InputWrapper
					name="issuance-rate"
					isValid={res.isValid('issuance-rate')}
					errors={res.getErrors('issuance-rate')}
				>
					<input
						type="number"
						name="issuance-rate"
						bind:value={formData.issuanceRate}
						on:input={handleChange}
					/>
				</InputWrapper>

				<label for="funding-target"
					>Funding target <em
						>~ Current target {$userDaos[$activeDao].onChainData.paymentCurrency}
						{fundingTarget === 0 ? '∞' : fundingTarget}</em
					>
				</label>
				<span class="xsmall"><em>* Put a 0 to make the target infinite</em></span>
				<CurrencyInput
					name="funding-target"
					currency={$userDaos[$activeDao].onChainData.paymentCurrency}
					bind:value={formData.fundingTarget}
					on:input={handleChange}
					isValid={res.isValid('funding-target')}
					errors={res.getErrors('funding-target')}
				/>
			</div>
		</div>
		<div class="button-wrapper">
			<Button
				width="extended"
				state={validChanges ? 'active' : 'disabled'}
				on:click={() => submitRoundChanges(formData)}>Submit changes</Button
			>
		</div>
	</div>
</Modal>

<style lang="scss">
	.main-wrapper {
		padding: var(--space-4);

		.content-wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-12);
			max-width: 700px;
		}

		.button-wrapper {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
