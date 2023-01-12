<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
</script>

<div class="column-5 align-start">
	<h4 class="w-medium">Fund Emerald DAO</h4>
	<p class="small">
		Sunt aliquip pariatur id reprehenderit non sit ex qui esse. Tempor non ullamco cillum dolore.
		Irure consectetur minim adipisicing proident laboris aliqua ut ad incididunt pariatur enim
		magna. Lorem id in exercitation nulla amet.
	</p>
	<Button on:click={fundActiveStep.increment} width="full-width">Accept</Button>
</div>
