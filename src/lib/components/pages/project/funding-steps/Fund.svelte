<script type="ts">
	import { createForm } from 'felte';
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { Column } from '@mateoroldos/svelte.bones';
	import { fundData } from '$stores/fund/FundDataStore';

	const { form } = createForm({
		onSubmit: (values) => {
			// ...
		}
	});
</script>

<Column>
	<h4>Fund Emerald DAO</h4>
	<form use:form>
		<label for="amount">Amount to Fund</label>
		<input type="number" name="amount" placeholder="1000" bind:value={$fundData.amount} />
		<label for="message">Add a special message</label>
		<textarea name="message" placeholder="Write a special message" bind:value={$fundData.message} />
	</form>
	<Button on:click={fundActiveStep.increment}>next</Button>
</Column>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		input {
			margin-bottom: 2rem;
		}
	}
</style>
