<script type="ts">
	import CreateProjectStepsCard from '$components/cards/CreateProjectStepsCard.svelte';
	import { user } from '$stores/flow/FlowStore';
</script>

<section class="container center">
	<CreateProjectStepsCard />
</section>

<style type="scss">
	section {
		min-height: 70vh;
	}
</style>
