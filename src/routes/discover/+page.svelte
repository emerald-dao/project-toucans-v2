<script>
	import ProjectCard from '$components/cards/ProjectCard.svelte';
</script>

<section class="container">
	<div class="column-8 align-center">
		<h2>DAO of July</h2>
		<ProjectCard />
	</div>
</section>

<section class="container">
	<div class="column-8 align-center">
		<h2>Trending Projects</h2>
		<div class="row-6">
			<ProjectCard story={false} />
			<ProjectCard story={false} />
		</div>
		<div />
	</div>
</section>
