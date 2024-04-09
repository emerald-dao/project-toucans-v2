<script type="ts">
	import { Button, InputWrapper } from '@emerald-dao/component-library';
	import { burnTokensExecution } from '$flow/actions';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { onMount } from 'svelte';

	export let activeCurrency: string;
	export let daoData: DAOProject;

	$: availableBalance = Number(daoData.onChainData.treasuryBalances[activeCurrency]);

	let amount = 0;
	let isValid = true;
	let errors: string[] = [];

	const handleChange = () => {
		if (amount <= availableBalance && amount > 0) {
			isValid = true;
			errors = [];
		} else if (amount > availableBalance) {
			isValid = false;
			errors = ['Cannot burn more than the available balance.'];
		} else if (amount <= 0) {
			isValid = false;
			errors = ['Cannot burn less than 0.'];
		}
	};

	onMount(() => {
		handleChange();
	});

	const handleCreateBurnAction = async () => {
		const actionResult = await burnTokensExecution(
			activeCurrency,
			daoData.generalInfo.project_id,
			daoData.generalInfo.owner,
			amount.toString()
		);

		if (actionResult.state === 'success') {
			amount = 0;
			handleChange();
		}
	};
</script>

<form
	id="dist-form"
	on:submit|preventDefault={handleCreateBurnAction}
	autocomplete="off"
	class="column-4"
>
	<InputWrapper name="amount" label="Amount" iconText={`$${activeCurrency}`} {errors} {isValid}>
		<input name="amount" type="text" bind:value={amount} on:input={handleChange} />
	</InputWrapper>
	<Button form="dist-form" width="full-width" state={isValid ? 'active' : 'disabled'}>
		Create Burn Action
	</Button>
</form>
