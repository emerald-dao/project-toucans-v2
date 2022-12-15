<script>
	import Icon from '@iconify/svelte';
</script>

<nav class="column-12 align-start">
	<div class="row-4 align-center">
		<img src="/ec-logo.png" alt="DAO Logo" />
		<h1 class="h4">Emerald City DAO</h1>
	</div>
	<div class="column-10 align-start">
		<a href="/admin" class="sidebar-link">
			<Icon icon="tabler:chart-infographic" />
			Stats
		</a>
		<a href="/admin/rounds" class="sidebar-link">
			<Icon icon="tabler:analyze" />
			Rounds
		</a>
		<a href="/admin/info" class="sidebar-link">
			<Icon icon="tabler:bolt" />
			Edit Info
		</a>
		<a href="/admin/distribute" class="sidebar-link">
			<Icon icon="tabler:arrows-maximize" />
			Distribute
		</a>
	</div>
</nav>

<style type="scss">
	nav {
		img {
			max-width: 80px;
			aspect-ratio: 1 / 1;
			object-fit: contain;
		}
	}
</style>
