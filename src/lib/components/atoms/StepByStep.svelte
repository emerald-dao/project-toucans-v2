<script type="ts">
	import type { Step } from '$lib/types/generator-step.interface';

	export let steps: Step[];
	export let activeStep: number;
</script>

<div>
	{#each steps as step, i}
		{i + 1}
		{step.title}
	{/each}
</div>
