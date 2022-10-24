<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { Column } from '@mateoroldos/svelte.bones';
</script>

<Column gap="small" align="flex-start">
	<h4>Fund Emerald DAO</h4>
	<p>
		Sunt aliquip pariatur id reprehenderit non sit ex qui esse. Tempor non ullamco cillum dolore.
		Irure consectetur minim adipisicing proident laboris aliqua ut ad incididunt pariatur enim
		magna. Lorem id in exercitation nulla amet.
	</p>
	<Button on:click={fundActiveStep.increment} size="full-width">next</Button>
</Column>

<style type="scss">
	p {
		max-width: 30ch;
		font-size: var(--fs-300);
	}
</style>
