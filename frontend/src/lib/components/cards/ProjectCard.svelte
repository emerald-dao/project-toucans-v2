<script type="ts">
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import { handleBannerImgError, handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let project: DaoDatabaseData;
</script>

<a href={`/p/${project.project_id}`} class="card-primary">
	<img
		src={project.banner_image ?? 'toucans-illustration.png'}
		on:error={(e) => handleBannerImgError(e)}
		alt={`${project.name} banner`}
		class="banner"
	/>
	<div class="content-wrapper column-5">
		<div class="row-3 align-center">
			<img src={project.logo} on:error={(e) => handleLogoImgError(e)} alt="DAO logo" class="logo" />
			<h3 style="text-align: left">{project.name}</h3>
		</div>
		<div class="row-3 align-end">
			{#if project.token_symbol}
				<Label size="small" color="tertiary" hasBorder={false}>{`$${project.token_symbol}`}</Label>
			{/if}
			<div class="row-2 align-end">
				{#if project.twitter}
					<a
						href={`https://twitter.com/${project.twitter}`}
						rel="noreferrer"
						class="header-link"
						target="_blank"
					>
						<Icon icon="tabler:brand-twitter" width="16" />
					</a>
				{/if}
				{#if project.discord}
					<a
						href={`https://discord.gg/${project.discord}`}
						rel="noreferrer"
						class="header-link"
						target="_blank"
					>
						<Icon icon="tabler:brand-discord" width="16" />
					</a>
				{/if}
				{#if project.website}
					<a
						href={`https://${project.website}`}
						rel="noreferrer"
						class="header-link"
						target="_blank"
					>
						<Icon icon="tabler:world" width="16" />
					</a>
				{/if}
			</div>
		</div>
		<p class="small" style="text-align:left">{project.description}</p>
	</div>
</a>

<style type="scss">
	.card-primary {
		display: flex;
		flex-direction: column;
		color: var(--clr-font-text);
		text-decoration: none;
		padding: 0;
		gap: var(--space-8);
		flex-grow: 1;
		border: none;
		overflow: hidden;

		.banner {
			width: 100%;
			height: 130px;
			object-fit: cover;
		}

		.content-wrapper {
			padding: 0 var(--space-10) var(--space-10) var(--space-10);

			.logo {
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
		}
	}
</style>
