<script>
	import Card from '$components/atoms/Card.svelte';
	import { Column, Row } from '@mateoroldos/svelte.bones';

	export let name = 'Emerald DAO';
	export let story = true;
</script>

<a href={`/discover/${name}`}>
	<Card>
		<div class="main-wrapper" class:with-story={story}>
			<Column align="flex-start" gap="small">
				<Row justify="flex-start" gap="small">
					<img src="/ec-logo.png" alt="DAO logo" />
					<h3>DAO Title</h3>
				</Row>
				<p>
					Sit commodo dolor nostrud in reprehenderit mollit ut exercitation voluptate incididunt
					laboris. Sit commodo dolor nostrud in reprehenderit mollit ut exercitation voluptate
					incididunt laboris.
				</p>
			</Column>
			{#if story}
				<div class="story-wrapper">
					<Column align="flex-start" gap="small">
						<h4>Story</h4>
						<p>
							Sit commodo dolor nostrud in reprehenderit mollit ut exercitation voluptate incididunt
							laboris. Reprehenderit consectetur veniam cupidatat nulla ad velit. Irure commodo
							pariatur dolor ut aute sunt qui. Sit commodo dolor nostrud in reprehenderit mollit ut
							exercitation voluptate incididunt laboris. Reprehenderit consectetur veniam cupidatat
							nulla ad velit. Irure commodo pariatur dolor ut aute sunt qui.
						</p>
					</Column>
				</div>
			{/if}
		</div>
	</Card>
</a>

<style type="scss">
	@use '../../../lib/styles/utils' as *;

	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		color: var(--clr-font-text);
		text-decoration: none;

		img {
			max-width: 100px;
		}

		.story-wrapper {
			@include mq(medium) {
				border-left: 1px var(--clr-neutral-400) solid;
				padding-left: 3rem;
			}

			h4 {
				font-size: var(--fs-400);
			}

			p {
				font-size: var(--fs-200);
			}
		}
	}

	.with-story {
		@include mq(medium) {
			display: grid;
			grid-template-columns: 3fr 2fr;
			align-items: flex-start;
		}
	}

	a:link {
		text-decoration: none;
	}

	a:visited {
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

	a:active {
		text-decoration: none;
	}
</style>
