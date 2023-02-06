<script type="ts">
	import { page } from '$app/stores';
	import DaoDetailsForm from '$lib/components/forms/DaoDetailsForm.svelte';
	import StepButtons from './atoms/StepButtons.svelte';

	let validForm = false;
</script>

<DaoDetailsForm bind:validForm />
<StepButtons active={validForm} />
