<script lang="ts">
	import OpenGraph from '$components/OpenGraph.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let data: DAOProject;
</script>

<OpenGraph
	image={data.generalInfo.banner_image}
	title={data.generalInfo.name}
	description={data.generalInfo.description}
/>

<slot />
