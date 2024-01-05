<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import { Currency, InputWrapper } from '@emerald-dao/component-library';
	import lockValidation from '../_validations/lockValidation';
	import type { SuiteRunResult } from 'vest';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import { lockTokens } from '$lib/features/distribute-tokens/functions/lockTokens';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button } from '$lib/features/distribute-tokens/components';

	export let activeCurrency: string;
	export let availableBalance: number | undefined;
	export let activeDaoData: DAOProject;

	let now = new Date().toISOString().split('T')[0];

	let formDist: Distribution = {
		address: '',
		amount: '',
		date: new Date(now)
	};

	let res = lockValidation.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address has currency vault...'];

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = lockValidation(
			formDist,
			target.name,
			availableBalance,
			activeDaoData.generalInfo.owner,
			activeDaoData.generalInfo.project_id,
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

	const resetDistribution = () => {
		formDist = {
			address: '',
			amount: '',
			date: new Date(now)
		};
	};

	const resetValidation = () => {
		lockValidation.reset();
		res = lockValidation.get();
	};

	$: if (activeCurrency) {
		resetDistribution();
		resetValidation();
	}

	const handleCreateLockAction = async () => {
		let inputDate;

		if (formDist.date) {
			inputDate = new Date(formDist.date).getTime() / 1000;
		}

		if (inputDate && Number(formDist.amount) > 0) {
			const actionResult = await lockTokens(
				activeDaoData,
				formDist.address,
				activeCurrency,
				inputDate,
				Number(formDist.amount)
			);

			if (actionResult.state === 'success') {
				resetDistribution();
				resetValidation();
			}
		}
	};
</script>

<form
	id="dist-form"
	on:submit|preventDefault={handleCreateLockAction}
	autocomplete="off"
	class="column-4"
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
				<UserAvatar address={formDist.address} userLink={false} fontSize="var(--font-size-0)" />
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
	<InputWrapper
		name="date"
		label="Date"
		errors={res.getErrors('date')}
		isValid={res.isValid('date')}
		><div class="date-picker-wrapper">
			<input
				type="datetime-local"
				name="date"
				bind:value={formDist.date}
				on:change={handleChange}
				min={now}
			/>
		</div>
	</InputWrapper>
	<Button disabled={!res.isValid()}>Lock Tokens</Button>
</form>

<style lang="scss">
	form {
		margin-block: var(--space-4);
	}

	.avatar-wrapper {
		margin-top: -0.8rem;
		margin-bottom: 1.2rem;
	}

	.date-picker-wrapper {
		width: 100%;

		input[type='datetime-local'] {
			color: var(--clr-text-main);
		}

		input[type='datetime-local']::-webkit-calendar-picker-indicator {
			filter: invert(50%);
		}
	}
</style>
