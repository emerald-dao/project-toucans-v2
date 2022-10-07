<script type="ts">
	import { steps } from '$stores/generator/StepsStore';
	import { StepByStep } from '$atoms';
</script>

<nav>
	<StepByStep steps={$steps} />
</nav>
