<script>
	import { ProjectMainSection, ProjectSidebarSection } from './components';
	import { Section, Container, Row } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Container>
		<div class="main-wrapper">
			<div class="grid">
				<ProjectSidebarSection />
				<ProjectMainSection />
			</div>
		</div>
	</Container>
</Section>

<style type="scss">
	@use '../../../lib/styles/utils' as *;

	.main-wrapper {
		display: flex;
		overflow: hidden;

		.grid {
			@include mq(medium) {
				display: grid;
				grid-template-columns: 1.3fr 2fr;
				gap: 4rem;
			}
		}
	}
</style>
