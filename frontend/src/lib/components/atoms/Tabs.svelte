<script type="ts">
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
	<div class="top-wrapper">
		{#each tabs as tab, i}
			<div class:active={activeTab === i} class="name" on:click={() => setActiveTab(i)} on:keydown>
				{tab.name}
			</div>
		{/each}
	</div>
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

		.top-wrapper {
			display: flex;
			flex-direction: row;
			gap: var(--space-10);
			border-bottom: 1px var(--clr-border-primary) solid;

			.name {
				cursor: pointer;
				padding-bottom: var(--space-2);
				font-size: var(--font-size-1);
				transition: 0.1s;
			}

			.name:hover {
				color: var(--clr-heading-main);
			}

			.active {
				color: var(--clr-heading-main);
				border-bottom: 2px solid var(--clr-heading-main);
			}
		}

		.tab-wrapper {
			overflow-y: auto;
		}
	}
</style>
