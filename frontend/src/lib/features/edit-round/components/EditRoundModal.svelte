<script type="ts">
	import { Button, Modal, getModal, InputWrapper } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import RoundDatesPicker from '$lib/features/round-generator/components/atoms/RoundDatesPicker.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';

	export let round: FundingCycle;

	$: adminData = getContext('admin-data') as {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	};

	$: activeDao = adminData.activeDao;
	$: userDaos = adminData.userDaos;

	const id = `edit-round-${round.details.cycleId}`;
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
				<InputWrapper name="issuance-rate" label="Issuance rate">
					<input type="number" name="issuance-rate" />
				</InputWrapper>
				<CurrencyInput
					label="Funding target"
					name="funding-target"
					currency={$userDaos[$activeDao].onChainData.paymentCurrency}
				/>
			</div>
		</div>
		<div class="button-wrapper">
			<Button>Submmit changes</Button>
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
