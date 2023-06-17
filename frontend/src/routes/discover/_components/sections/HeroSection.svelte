<script lang="ts">
	import { theme } from '$stores/ThemeStore';
</script>

<section class={`section-large discover-hero-${$theme}`}>
	<div class="container-small column-5">
		<h1 class="w-medium">
			Discover thriving DAOs and tokens built <strong>#onFlow</strong>
		</h1>
		<p class="large">
			Below you will find a list of DAOs and tokens that have launched on Toucans. Explore all
			projects and the most popular. The stats are updated every 30 minutes.
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
