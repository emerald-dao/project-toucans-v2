<script type="ts">
	import { Button, FlowConnect } from '@emerald-dao/component-library';
	import { AdminNav } from './__components';
	import { setContext } from 'svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$stores/flow/FlowStore';
	import { logIn, unauthenticate } from '$flow/actions';

	interface Data {
		projects: (FinancialDao | CommunityDao)[]
	}

	export let data: Data;

	const activeDao = writable(0);

	setContext<{
		activeDao: Writable<number>;
		userDaos: (FinancialDao | CommunityDao)[];
	}>('admin-data', {
		userDaos: data.projects,
		activeDao
	});
</script>

<section>
	<div class="container">
		{#if !$user.addr}
			<div class="card-primary column-7 align-center">
				<span>Connect your Flow wallet to access the admin dashboard</span>
				<FlowConnect {logIn} {unauthenticate} {user}/>
			</div>
		{:else if data.projects.length < 1}
			<div class="card-primary column-7 align-center">
				<span>You don't have any DAO yet</span>
				<Button size="large" href="/dao-generator/generate">Create DAO</Button>
			</div>
		{:else}
			<AdminNav />
			<slot />
		{/if}
	</div>
</section>

				
<style type="scss">
	section {
		.container {
			display: flex;
			flex-direction: column;
			gap: var(--space-8);
			min-height: 70vh;

			@include mq(medium) {
				display: grid;
				grid-template-columns: 220px auto;
				gap: var(--space-16);
			}

			.card-primary {
				padding: var(--space-12);
				width: fit-content;

				span {
					text-align: center;
					min-width: 18ch;
				}
			}
		}

	}
</style>
