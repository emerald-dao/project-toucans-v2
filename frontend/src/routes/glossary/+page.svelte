<script lang="ts">
	import GLOSSARY from '$lib/config/glossary';

	function formatTerm(inputString: string): string {
		const words = inputString.split(/(?=[A-Z])/);

		words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

		for (let i = 1; i < words.length; i++) {
			words[i] = words[i].charAt(0).toLowerCase() + words[i].slice(1);
		}

		const outputString = words.join(' ');

		return outputString;
	}
</script>

<section class="container-small">
	<h1>Glossary</h1>
	{#each Object.entries(GLOSSARY) as [term, definition]}
		<h2>{formatTerm(term)}</h2>
		<p>{definition}</p>
	{/each}
</section>

<style lang="scss">
	h1 {
		margin-bottom: var(--space-12);
	}

	h2 {
		font-size: var(--font-size-4);
		margin-bottom: var(--space-2);
	}

	p {
		margin-bottom: var(--space-12);
	}
</style>
