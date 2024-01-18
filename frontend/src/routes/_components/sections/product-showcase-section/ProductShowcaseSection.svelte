<script lang="ts">
	import * as Section from '../atoms/section';
	import Saos from 'saos';
</script>

<section class="section-large container-large column-12 align-center">
	<Section.Header>
		<Section.Heading>
			<Section.HeadingHighlight>Incredibly easy</Section.HeadingHighlight>
			token & community managment
		</Section.Heading>
	</Section.Header>
	<Saos animation={'puff-in-center 0.7s ease-in both'} once={true} top={350}>
		<img src="/dashboard-screenshot.png" alt="Product dashboard screenshot" />
	</Saos>
</section>

<style lang="scss">
	img {
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-2);
		box-shadow: 0 20px 70px -50px var(--clr-primary-main);
	}

	@keyframes -global-puff-in-center {
		0% {
			transform: scale(2);
			filter: blur(4px);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			filter: blur(0px);
			opacity: 1;
		}
	}
</style>
