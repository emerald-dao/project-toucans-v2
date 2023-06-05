<script type="ts">
	import CreateProjectStepsCard from '$components/cards/CreateProjectStepsCard.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { Seo } from '@emerald-dao/component-library';
</script>

<section class="container center">
	<CreateProjectStepsCard />
</section>

<Seo
	title={`Generato DAO | Toucans`}
	description={`Generate your own DAO in Toucans`}
	type="WebPage"
	image="https://toucans.ecdao.org/favicon.png"
/>

<style type="scss">
	section {
		min-height: 70vh;
	}
</style>
