<script type="ts">
	import CreateProjectStepsCard from '$components/cards/CreateProjectStepsCard.svelte';
</script>

<section class="container">
	<div class="left-wrapper">
		<div class="title-wrapper">
			<span class="tagline">No-code dao generator</span>
			<h1 class="w-medium">Create a token.<br /> Launch a DAO</h1>
			<p>
				Toucans is the first fungible token creation and management platform on the Flow blockchain
				that makes it easy for internet communities unlock the power of human-centric coordination.
			</p>
		</div>
	</div>
	<div class="right-wrapper">
		<CreateProjectStepsCard />
	</div>
</section>

<style type="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: justify;

		@include mq('medium') {
			display: grid;
			grid-template-columns: 2fr 1fr;
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
			margin: var(--space-13) 0;

			@include mq('medium') {
				margin: 0;
			}
		}
	}
</style>
