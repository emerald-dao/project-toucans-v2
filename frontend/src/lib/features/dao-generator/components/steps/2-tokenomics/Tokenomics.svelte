<script type="ts">
	import { fly } from 'svelte/transition';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import tokenomicsSuite from '$lib/validations/tokenomicsSuite';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target?.name) {
			res = tokenomicsSuite($daoGeneratorData.tokenomics, target.name);
		}
	};

	let res = tokenomicsSuite.get();

	let editMode = false;
</script>

<div class="column-4" in:fly={{ y: 30, duration: 400 }}>
	<div in:fly|local={{ y: 40, duration: 400 }} class="column align-center">
		<p>EDIT THIS COMPONENT</p>
		<p>You can create it now or create it afterwards in the admin dashboard.</p>
	</div>
	<StepButtons />
</div>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.range-wrapper {
			margin-bottom: var(--space-7);
		}
	}

	p {
		text-align: center;
		margin-bottom: var(--space-2);

		&:last-of-type {
			margin-bottom: var(--space-4);
		}
	}
</style>
