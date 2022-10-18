<script>
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import { Column, Container, Row, Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Container>
		<Column gap="small">
			<h2>DAO of July</h2>
			<ProjectCard />
		</Column>
	</Container>
</Section>

<Section>
	<Container>
		<Column gap="small">
			<h2>Trending Projects</h2>
			<Row>
				<ProjectCard story={false} />
				<ProjectCard story={false} />
			</Row>
		</Column>
	</Container>
</Section>
