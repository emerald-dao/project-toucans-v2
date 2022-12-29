<script type="ts">
	import CreateProjectStepsCard from '$components/cards/CreateProjectStepsCard.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	interface stepData {
		number: number;
		title: string;
		description: string;
		element: HTMLElement | undefined;
		intersecting: boolean;
	}

	let stepsData: stepData[] = [
		{
			number: 1,
			title: 'Select your DAO details',
			description:
				'Whether you want to create a token to raise funds in a treasury, or simply as utility rewards for your community, Toucans makes it easy for you to build organizations together,online.',
			element: undefined,
			intersecting: false
		},
		{
			number: 2,
			title: 'Select your DAO details',
			description:
				'Whether you want to create a token to raise funds in a treasury, or simply as utility rewards for your community, Toucans makes it easy for you to build organizations together,online.',
			element: undefined,
			intersecting: false
		},
		{
			number: 3,
			title: 'Select your DAO details',
			description:
				'Whether you want to create a token to raise funds in a treasury, or simply as utility rewards for your community, Toucans makes it easy for you to build organizations together,online.',
			element: undefined,
			intersecting: false
		}
	];
</script>

<section class="container">
	<div class="hide-on-mobile left-wrapper">
		<CreateProjectStepsCard />
	</div>
	<div class="right-wrapper">
		<div class="title-wrapper">
			<span class="tagline">No Code Required</span>
			<h2 class="w-medium">Creating your own token is easy</h2>
			<p>
				Whether you want to create a token to raise funds in a treasury, or simply as utility &
				rewards for your community, Toucans makes it easy for you to build organizations together,
				online.
			</p>
		</div>
		<div class="column-16">
			{#each stepsData as step, i}
				<IntersectionObserver
					element={stepsData[i].element}
					bind:intersecting={stepsData[i].intersecting}
					threshold={1}
					rootMargin="-115px"
				>
					<div bind:this={stepsData[i].element} class="steps-wrapper">
						<div class="row-3 align-center">
							<div
								class="circle center"
								class:active={stepsData[i].intersecting && !stepsData[i + 1]?.intersecting}
							>
								<span class="w-bold">{step.number}</span>
							</div>
							<h4>{step.title}</h4>
						</div>
						<p>{step.description}</p>
					</div>
				</IntersectionObserver>
			{/each}
		</div>
	</div>
</section>

<style type="scss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: justify;
		max-width: 45ch;

		@include mq('medium') {
			display: grid;
			grid-template-columns: 1fr 1fr;
			max-width: none;
			text-align: justify;
			align-items: flex-start;
		}

		.left-wrapper {
			position: sticky;
			top: var(--space-20);
		}

		.title-wrapper {
			text-align: center;
			margin: var(--space-13) 0;

			@include mq('medium') {
				text-align: justify;
				margin-top: 0;
				margin-bottom: var(--space-16);
			}

			h2 {
				margin: var(--space-6) 0;
			}
		}

		.steps-wrapper {
			.circle {
				width: 38px;
				height: 32px;
				background-color: var(--clr-surface-primary);
				border-radius: 14px;
				transition: 0.5s;
				transition-delay: 0.1s;
			}

			.circle.active {
				background-color: var(--clr-primary-main);
				color: var(--clr-heading-inverse);
			}

			h4 {
				display: inline;
			}

			p {
				margin-top: var(--space-6);
			}
		}
	}
</style>
