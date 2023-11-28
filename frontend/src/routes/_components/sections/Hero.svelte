<script type="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import { Button } from '@emerald-dao/component-library';
	import CirclesAndBlur from './atoms/CirclesAndBlur.svelte';
</script>

<section class="section-large column-12">
	<div class="container-medium">
		<div class="left-wrapper">
			<div class="title-wrapper">
				<span class="tagline">No-code dao generator</span>
				<h1 class="w-medium">Create a token.<br /> Launch a DAO</h1>
				<p class="large">
					We make it easy for digital communities to unlock the power of human-centric coordination.
					Equipped with out-of-the-box voting, treasury management, token creation, and more.
				</p>
			</div>
		</div>
		<div class="right-wrapper">
			<ProjectCard
				project={{
					name: 'Emerald City DAO',
					logo: '/ec-logo.png',
					description:
						'The first DAO on the Flow blockchain. Emerald City is the creator of Toucans and other products/tools in the ecosystem.',
					token_symbol: 'EMLD',
					twitter: 'emerald_dao',
					discord: 'emeraldcity',
					website: 'ecdao.org'
				}}
			/>
			<!-- <CirclesAndBlur /> -->
		</div>
	</div>
	<div class="column-2 center">
		<Button color="primary" size="large" width="extended" href="/event-generator"
			>Create a DAO - it's free!
		</Button>
		<div class="column center">
			<span class="xsmall">Creation is 100% free</span>
			<span class="xsmall">We only charge a tiny percentage on funding.</span>
		</div>
	</div>
</section>

<style type="scss">
	section {
		border-bottom: 1px solid var(--clr-border-primary);
		.container-medium {
			display: flex;
			flex-direction: column;
			align-items: center;

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
						max-width: 50ch;
					}
				}
			}

			.right-wrapper {
				display: flex;
				max-width: 55ch;
				margin-top: var(--space-12);

				@include mq('medium') {
					margin-top: 0;
				}
			}
		}
	}
</style>
