<script>
	import { AdminNav } from '$components/pages/admin';
	import { Container, Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Container>
		<div class="main-wrapper">
			<AdminNav />
			<div class="content-wrapper">
				<slot />
			</div>
		</div>
	</Container>
</Section>

<style type="scss">
	@use '../../lib/styles/utils' as *;

	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 3fr;
		}

		.content-wrapper {
			padding: 2rem;
		}
	}
</style>
