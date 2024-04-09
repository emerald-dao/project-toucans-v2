<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import { AdminNav } from './_components';
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { invalidate } from '$app/navigation';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let data;

	let screenSize: number;

	onMount(() => {
		const subscription = supabase
			.channel('events')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'events',
					filter: `project_id=eq.${data.activeDao.generalInfo.project_id}`
				},
				async () => {
					await invalidate('app:dao-data');
				}
			)
			.subscribe();

		return () => supabase.removeChannel(subscription);
	});
</script>

<svelte:window bind:innerWidth={screenSize} />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else if !data.activeDao}
	<section class="container flex centered">
		<div class="card-primary column-7 align-center">
			<span>This DAO does not exist, or you are not a signer of its treasury.</span>
			<Button size="large" href="/dao-generator">Create DAO</Button>
		</div>
	</section>
{:else}
	<section class="dashboard-section">
		<AdminNav activeDao={data.activeDao} daos={data.daos} />
		<div class="main-wrapper">
			<slot />
		</div>
	</section>
{/if}

<style type="scss">
	section {
		padding: 0;
		display: flex;
		flex: 1;
		overflow: hidden;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 320px auto;
		}

		&.centered {
			align-items: center;
		}

		.main-wrapper {
			padding-block: var(--space-11);
			padding-inline: var(--space-12);
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			padding-inline: var(--space-12) 5vw;
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
