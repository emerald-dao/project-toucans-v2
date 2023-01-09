<script type="ts">
	import { page } from '$app/stores';
	import DaoDetailsForm from '$lib/components/forms/DaoDetailsForm.svelte';
	import StepButtons from './atoms/StepButtons.svelte';

	console.log($page.data);
</script>

<DaoDetailsForm />
<StepButtons active={true} />
