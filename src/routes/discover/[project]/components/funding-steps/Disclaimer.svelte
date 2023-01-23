<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';
</script>

<div class="column-5 align-start">
	<h4 class="w-medium">Fund {$fundData.daoName}</h4>
	<p class="small">
		By agreeing to fund this project, you are instilling trust upon this project. Toucans is not
		responsible for funds lost or stolen, or any losses by projects or their supporters.
	</p>
	<Button on:click={fundActiveStep.increment} width="full-width">Accept</Button>
</div>
