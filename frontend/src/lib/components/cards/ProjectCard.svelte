<script type="ts">
	import { Label } from '@emerald-dao/component-library';
	export let name: string;
	export let projectId: string;
	export let image: string = '/ec-logo.png';
	export let labels: string[] = [];
	export let description: string;
	export let story: boolean = false;
</script>

<a href={`/p/${projectId}`} class="card-primary" class:with-story={story}>
	<div class="column-5">
		<div class="row-3 align-center">
			<img src={image} alt="DAO logo" />
			<h3>{name}</h3>
		</div>
		<div class="row-3">
			{#each labels as label}
				<Label color="neutral" size="small">{label}</Label>
			{/each}
		</div>
		<p>{description}</p>
	</div>
	{#if story}
		<div class="story-wrapper">
			<div class="column-4">
				<h4>Story</h4>
				<p class="small">
					Sit commodo dolor nostrud in reprehenderit mollit ut exercitation voluptate incididunt
					laboris. Reprehenderit consectetur veniam cupidatat nulla ad velit. Irure commodo pariatur
					dolor ut aute sunt qui. Sit commodo dolor nostrud in reprehenderit mollit ut exercitation
					voluptate incididunt laboris. Reprehenderit consectetur veniam cupidatat nulla ad velit.
					Irure commodo pariatur dolor ut aute sunt qui.
				</p>
			</div>
		</div>
	{/if}
</a>

<style type="scss">
	.card-primary {
		display: flex;
		flex-direction: column;
		color: var(--clr-font-text);
		text-decoration: none;
		padding: var(--space-10);
		gap: var(--space-8);
		flex-grow: 1;

		img {
			max-width: 50px;
		}

		p {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 4;
			line-clamp: 4;
			-webkit-box-orient: vertical;
		}

		.story-wrapper {
			@include mq(medium) {
				border-left: 1px var(--clr-border-primary) solid;
				padding-left: var(--space-7);
				height: 100%;

				p {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 8;
					line-clamp: 8;
					-webkit-box-orient: vertical;
				}
			}

			h4 {
				font-size: var(--font-size-5);
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
</style>
