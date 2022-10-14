<script>
	import { ProjectMain, ProjectSidebar } from '$components/pages/project';
	import { Section, Container } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Container>
		<div class="main-wrapper">
			<ProjectSidebar />
			<ProjectMain />
		</div>
	</Container>
</Section>

<style type="scss">
	@use '../../../lib/styles/utils' as *;

	.main-wrapper {
		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 2fr;
			gap: 4rem;
		}
	}
</style>
