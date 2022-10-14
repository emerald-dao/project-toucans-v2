<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { Row } from '@mateoroldos/svelte.bones';
	import type { SvelteComponent } from 'svelte';

	interface TabObject {
		name: string;
		component: typeof SvelteComponent;
	}

	export let tabs: TabObject[];
	let activeTab = 0;

	const setActiveTab = (index: number) => {
		activeTab = index;
	};
</script>

<Row justify="flex-start">
	{#each tabs as tab, i}
		<Button
			type="transparent"
			color={i === activeTab ? 'primary' : 'neutral'}
			on:click={() => setActiveTab(i)}>{tab.name}</Button
		>
	{/each}
</Row>
<div>
	<svelte:component this={tabs[activeTab].component} />
</div>
