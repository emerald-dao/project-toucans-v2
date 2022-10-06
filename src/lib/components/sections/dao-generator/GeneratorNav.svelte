<script type="ts">
	import { steps } from '$stores/generator/StepsStore';
	import { StepByStep } from '$atoms';
</script>

<StepByStep steps={$steps} />
