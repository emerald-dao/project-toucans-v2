<script type="ts">
	import { onMount } from 'svelte';
	import newRoundSuite from '$lib/validations/newRoundSuite';
	import { InputWrapper } from '@emerald-dao/component-library';

	let now = new Date();
	let nowString = now.toISOString().split('T')[0];
	let oneMonthForwardSting = new Date(new Date().setMonth(new Date().getMonth() + 1))
		.toISOString()
		.split('T')[0];

	let formData: FormData = {
		startDate: nowString,
		endDate: oneMonthForwardSting,
		fundingGoal: 0
	};

	interface FormData {
		startDate: string;
		endDate: string;
		fundingGoal: number;
	}

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = newRoundSuite(formData, target.name);
	};

	onMount(() => {
		startDateInput.min = nowString;
	});

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;

	let res = newRoundSuite.get();

	$: if (endDateInput) endDateInput.min = formData.startDate;
	$: if (new Date(formData.startDate) > new Date(formData.endDate))
		formData.endDate = new Date(
			new Date(formData.startDate).setMonth(new Date(formData.startDate).getMonth() + 1)
		)
			.toISOString()
			.split('T')[0];
</script>

<div class="column-4">
	<span>General Info</span>
	<form class="column-4" autocomplete="off">
		<div class="row-6">
			<div>
				<InputWrapper
					name="startDate"
					errors={res.getErrors('startDate')}
					isValid={res.isValid('startDate')}
					label="Start date"
				>
					<input
						type="date"
						name="startDate"
						id="startDate"
						bind:this={startDateInput}
						bind:value={formData.startDate}
						on:input={handleChange}
					/>
				</InputWrapper>
			</div>
			<div>
				<InputWrapper
					name="endDate"
					errors={res.getErrors('endDate')}
					isValid={res.isValid('endDate')}
					label="End date"
				>
					<input
						type="date"
						name="endDate"
						id="endDate"
						bind:this={endDateInput}
						bind:value={formData.endDate}
						on:input={handleChange}
					/>
				</InputWrapper>
			</div>
		</div>
		<div>
			<InputWrapper
				name="fundingGoal"
				errors={res.getErrors('fundingGoal')}
				isValid={res.isValid('fundingGoal')}
				label="Funding goal"
			>
				<input
					type="number"
					name="fundingGoal"
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
