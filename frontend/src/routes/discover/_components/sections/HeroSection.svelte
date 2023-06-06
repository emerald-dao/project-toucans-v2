<script lang="ts">
	import { theme } from '$stores/ThemeStore';
</script>

<section class={`section-large discover-hero-${$theme}`}>
	<div class="container-small column-5">
		<h1 class="w-medium">
			Discover thriving communities and tokens built <strong>#onFlow</strong>
		</h1>
		<p class="large">
			Step right in and immerse yourself in a world of limitless possibilities on the Flow
			blockchain! We are thrilled to have you here, ready to explore the incredible DAOs thriving
			within this innovative ecosystem.
		</p>
	</div>
</section>

<style type="scss">
	.discover-hero {
		&-light {
			background: linear-gradient(rgba(250, 250, 250, 0.96), rgba(250, 250, 250, 1)),
				url(/toucans-illustration.png);
			background-size: cover;
		}

		&-dark {
			background: linear-gradient(rgba(18, 18, 18, 0.96), rgba(18, 18, 18, 1)),
				url(/toucans-illustration.png);
			background-size: cover;
		}
	}

	p {
		max-width: 65ch;
	}

	strong {
		color: var(--clr-primary-main);
	}

	h1 {
		font-size: var(--font-size-7);

		@include mq(small) {
			font-size: var(--font-size-9);
		}
	}
</style>
