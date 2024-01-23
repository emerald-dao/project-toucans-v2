<script lang="ts">
	import * as Section from '../atoms/section';
</script>

<section class="section-large container-large column-12 align-center">
	<Section.Header>
		<Section.Heading>
			<Section.HeadingHighlight>Incredibly easy</Section.HeadingHighlight>
			token & community managment.
		</Section.Heading>
	</Section.Header>
	<div class="a">
		<img src="/dashboard-screenshot.png" alt="Product dashboard screenshot" />
	</div>
</section>

<style lang="scss">
	.a {
		--border-size: 1px;
		--border-angle: 0turn;

		img {
			border-radius: calc(var(--radius-1));
		}

		padding: var(--border-size);
		border-radius: var(--radius-1);
		overflow: hidden;
		box-shadow: 0 20px 70px -50px var(--clr-primary-main);
		background-image: conic-gradient(
				from var(--border-angle),
				var(--clr-border-primary),
				var(--clr-border-primary) 50%,
				transparent
			),
			conic-gradient(
				from var(--border-angle),
				var(--clr-border-primary) 90%,
				var(--clr-tertiary-main),
				var(--clr-primary-main)
			);
		background-size: calc(100% - (var(--border-size) * 8)) calc(100% - (var(--border-size) * 2)),
			cover;
		background-position: center center;
		background-repeat: no-repeat;
		animation: bg-spin 12s linear infinite;

		@keyframes bg-spin {
			to {
				--border-angle: 1turn;
			}
		}
	}

	@property --border-angle {
		syntax: '<angle>';
		inherits: true;
		initial-value: 0turn;
	}
</style>
