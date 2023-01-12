<script>
	import ProjectCard from '$components/cards/ProjectCard.svelte';
</script>

<section class="container-small">
	<div class="column-12 align-center">
		<h3>DAO of July</h3>
		<ProjectCard />
	</div>
</section>

<section class="container-small">
	<div class="column-12 align-center">
		<h3>Trending Projects</h3>
		<div class="row-6">
			<ProjectCard story={false} />
			<ProjectCard story={false} />
		</div>
		<div class="row-6">
			<ProjectCard story={false} />
			<ProjectCard story={false} />
		</div>
		<div class="row-6">
			<ProjectCard story={false} />
			<ProjectCard story={false} />
		</div>
		<div />
	</div>
</section>

<style type="scss">
	section:first-child {
		border-bottom: 1px var(--clr-border-primary) solid;
	}
</style>
