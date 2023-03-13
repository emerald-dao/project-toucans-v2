<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { AdminNav } from './_components';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$stores/flow/FlowStore';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';

	interface Data {
		projects: DAOProject[];
	}

	export let data: Data;

	const activeDao = writable(0);

	setContext<{
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	}>('admin-data', {
		userDaos: data.projects,
		activeDao
	});
</script>

{#if !$user.addr}
	<ConnectPage />
{:else if data.projects.length < 1}
	<section class="centered">
		<div class="card-primary column-7 align-center">
			<span>You don't have any DAO yet</span>
			<Button size="large" href="/dao-generator/generate">Create DAO</Button>
		</div>
	</section>
{:else}
	<section>
		<div class="container-large">
			<AdminNav />
			<div class="main-wrapper">
				<slot />
			</div>
		</div>
	</section>
{/if}

<style type="scss">
	section {
		padding: 0;
		display: flex;
		flex: 1;
		justify-content: center;

		&.centered {
			align-items: center;
		}

		.container-large {
			display: flex;
			flex-direction: column;
			gap: var(--space-8);

			@include mq(medium) {
				display: grid;
				grid-template-columns: 280px auto;
				gap: var(--space-12);
			}

			.main-wrapper {
				padding-block: var(--space-11);
				display: flex;
				flex-direction: column;
			}
		}

		.card-primary {
			padding: var(--space-12);
			width: fit-content;
			height: fit-content;

			span {
				text-align: center;
				min-width: 18ch;
			}
		}
	}
</style>
