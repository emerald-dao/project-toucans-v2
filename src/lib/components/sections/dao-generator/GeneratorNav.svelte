<script type="ts">
	import { steps } from '$stores/generator/Steps';
	import { activeStep } from '$stores/generator/ActiveStep';
	import { StepByStep } from '$atoms';
</script>

<StepByStep steps={$steps} activeStep={$activeStep} />
