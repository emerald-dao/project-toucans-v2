<script type="ts">
	import { DaoType } from '$lib/types/dao-project.interface';

	import Icon from '@iconify/svelte';

	export let daoType: DaoType;
</script>

<nav class="column-12 align-start nav-wrapper">
	<div class="row-4 align-center">
		<img src="/ec-logo.png" alt="DAO Logo" />
		<h1 class="h4">Emerald City DAO</h1>
	</div>
	<div class="column-10 align-start">
		<a href="/admin" class="sidebar-link">
			<Icon icon="tabler:chart-infographic" />
			Stats
		</a>
		{#if daoType === DaoType.Financial}
			<a href="/admin/rounds" class="sidebar-link">
				<Icon icon="tabler:analyze" />
				Rounds
			</a>
		{/if}
		{#if daoType === DaoType.Community}
			<a href="/admin/distribute" class="sidebar-link distribute-display">
				<Icon icon="tabler:arrows-maximize" />
				Distribute
			</a>
		{/if}
		<a href="/admin/info" class="sidebar-link">
			<Icon icon="tabler:bolt" />
			Edit Info
		</a>
	</div>
</nav>

<style type="scss">
	.nav-wrapper {
		padding-bottom: var(--space-5);
		border-bottom: 1px solid var(--clr-neutral-400);

		@include mq('medium') {
			border-bottom: none;
		}

		.distribute-display {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}
	}
	nav {
		img {
			max-width: 80px;
			aspect-ratio: 1 / 1;
			object-fit: contain;
		}
	}
</style>
