<script type="ts">
	import { fly } from 'svelte/transition';
	import DaoDetailsForm from '$lib/components/forms/DaoDetailsForm.svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';

	let validForm = false;
</script>

<div in:fly="{{ y: 30, duration: 400 }}">
	<DaoDetailsForm bind:validForm />
	<StepButtons active={validForm} />
</div>
