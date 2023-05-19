<script type="ts">
	import CirclesAndBlur from './atoms/CirclesAndBlur.svelte';
</script>

<section class="section-large">
	<div class="container-medium">
		<div class="left-wrapper">
			<div class="title-wrapper">
				<span class="tagline">No-code dao generator</span>
				<h1 class="w-medium">Create a token.<br /> Launch a DAO</h1>
				<p class="large">
					Toucans is the first fungible token creation and management platform on the Flow
					blockchain that makes it easy for digital communities to unlock the power of human-centric
					coordination.
				</p>
			</div>
		</div>
		<div class="right-wrapper">
			<CirclesAndBlur />
		</div>
	</div>
</section>

<style type="scss">
	section {
		.container-medium {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: justify;

			@include mq('medium') {
				display: grid;
				grid-template-columns: 1.5fr 1fr;
			}

			.left-wrapper {
				@include mq('medium') {
					margin-right: var(--space-13);
				}

				.title-wrapper {
					text-align: center;

					@include mq('medium') {
						align-items: flex-start;
						text-align: start;
					}

					h1 {
						margin: var(--space-6) 0;
					}

					p {
						max-width: 45ch;
					}
				}
			}

			.right-wrapper {
				display: flex;
				height: 100%;
			}
		}
	}
</style>
