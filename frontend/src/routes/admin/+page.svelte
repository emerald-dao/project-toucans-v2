<script type="ts">
	import { Button, Seo } from '@emerald-dao/component-library';
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { invalidate } from '$app/navigation';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';

	let screenSize: number;

	const onChangeUser = async () => {
		await invalidate('app:admin');
	};

	$: $user.addr && onChangeUser();
</script>

<svelte:window bind:innerWidth={screenSize} />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else}
	<section class="container flex centered">
		<div class="card-primary column-7 align-center">
			<span>You do not have any DAOs to manage.</span>
			<Button size="large" href="/dao-generator">Create DAO</Button>
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
