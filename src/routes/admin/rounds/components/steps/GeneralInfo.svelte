<script type="ts">
	import newRoundSuite from '$lib/validations/newRoundSuite';
	import { InputWrapper } from '@emerald-dao/component-library';

	let formData: FormData = {
		fundingGoal: 0
	};

	interface FormData {
		fundingGoal: number;
	}

	const handleChange = () => {
		res = newRoundSuite(formData);
		console.log(res);
	};

	let res = newRoundSuite.get();
</script>

<div class="column-4">
	<span>General Info</span>
	<form class="column-4">
		<div class="row-6">
			<div>
				<label for="start-date">Start date</label>
				<input type="date" id="start-date" />
			</div>
			<div>
				<label for="end-date">End date</label>
				<input type="date" id="end-date" />
			</div>
		</div>
		<div>
			<InputWrapper
				name="funding-goal"
				errors={res.getErrors('fundingGoal')}
				isValid={res.isValid('fundingGoal')}
				label="Funding goal"
			>
				<input
					type="number"
					id="funding-goal"
					bind:value={formData.fundingGoal}
					on:input={handleChange}
				/>
			</InputWrapper>
		</div>
	</form>
</div>

<style type="scss">
	span {
		color: var(--clr-heading-main);
	}
</style>
