<script type="ts">
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	export let name: string;
	export let projectId: string;
	export let image: string = '/ec-logo.png';
	export let labels: string[] = [];
	export let description: string;
	export let story: string = '';
	export let twitter: string | null;
	export let discord: string | null;
	export let tokenSymbol: string;
	export let website: string | null;
</script>

<a href={`/p/${projectId}`} class="card-primary" class:with-story={story}>
	<div class="column-5">
		<div class="row-3 align-center">
			<img src={image} alt="DAO logo" />
			<h3>{name}</h3>
		</div>
		{#if twitter || discord || website}
			<div class="row-3 align-end">
				<Label size="small" color="tertiary" hasBorder={false}>{`$${tokenSymbol}`}</Label>
				<div class="row-2 align-end">
					{#if twitter}
						<a
							href={`https://twitter.com/${twitter}`}
							rel="noreferrer"
							class="header-link"
							target="_blank"
						>
							<Icon icon="tabler:brand-twitter" width="16" />
						</a>
					{/if}
					{#if discord}
						<a
							href={`https://discord.gg/invite/${discord}`}
							rel="noreferrer"
							class="header-link"
							target="_blank"
						>
							<Icon icon="tabler:brand-discord" width="16" />
						</a>
					{/if}
					{#if website}
						<a href={`https://${website}`} rel="noreferrer" class="header-link" target="_blank">
							<Icon icon="tabler:world" width="16" />
						</a>
					{/if}
				</div>
			</div>
		{/if}
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
					{story}
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
