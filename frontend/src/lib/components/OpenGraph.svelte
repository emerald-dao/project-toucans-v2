<script lang="ts">
	import { page } from '$app/stores';
	import dappInfo from '$lib/config/config';

	export let title: string | undefined = undefined;
	export let description = dappInfo.description;
	export let image = `${$page.url.origin}/open-graph.jpg`;

	$: resolvedTitle = title ? ` ${title} | ${dappInfo.title}` : `${dappInfo.title}`;
</script>

<svelte:head>
	<title>{resolvedTitle}</title>

	<meta name="title" content={resolvedTitle} />
	<meta name="description" content={description} />
	<meta name="image" content={image} />

	<meta itemprop="name" content={resolvedTitle} />
	<meta itemprop="description" content={description} />
	<meta itemprop="image" content={image} />

	<meta property="og:title" content={resolvedTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={dappInfo.title} />
	<meta property="og:url" content={$page.url.href} />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
