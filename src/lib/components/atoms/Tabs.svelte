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

<div class="main-wrapper">
	<Row justify="flex-start">
		{#each tabs as tab, i}
			<div class:active={activeTab === i} class="name" on:click={() => setActiveTab(i)} on:keydown>
				{tab.name}
			</div>
		{/each}
	</Row>
	<div class="tab-wrapper">
		<svelte:component this={tabs[activeTab].component} />
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 1rem;
		height: 100%;
		min-height: 1px;

		.name {
			cursor: pointer;
			padding-bottom: var(--space-2);
		}

		.active {
			color: var(--clr-heading-main);
			border-bottom: 1px solid var(--clr-heading-main);
		}

		.tab-wrapper {
			overflow-y: auto;
		}
	}
</style>
