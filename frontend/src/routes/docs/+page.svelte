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

<!-- Risks -->
<section class="container-small risks">
	<h1>Risks</h1>
	<p>
		When a user creates a DAO on the Toucans platform, the fungible token smart contract that is
		created is stored in the creator's account storage.
	</p>
	<p>
		Although we believe this is a huge advantage because it allows users to have full control over
		their contract and gives DAOs independence from our platform, it also means that they can
		directly manipulate the token contract.
	</p>
	<i>The following are the main risks related to this.</i>
	<h3>Tokens can be minted even if this feature is turned off</h3>
	<p>
		The project owner can mint tokens even if the minting feature is turned off by updating their
		contract. This can potentially cause inflation and impact the value of tokens.
	</p>
	<p>
		The minting being turned off/on should solely be used as a communication tool from the owner to
		their community that they do not intend to ever mint.
	</p>
	<h3>Total supply updates</h3>
	<p>
		Project administrators can update the total supply at their discretion, which may affect funding
		overflow calculations and impact the value of tokens.
	</p>
	<p>
		This can be done simply by updating the total supply number, or by minting tokens as described
		above.
	</p>
	<h3>Max supply can be edited</h3>
	<p>
		If project administrators configure a max supply, they can change the it to be a different
		number, which may affect how much they can mint and potentially impact the value of tokens.
	</p>
	<p>
		If there is a max supply present, it should solely be used as a communication tool from the
		owner to their community that they do not intend to ever mint more than a certain amount.
	</p>
</section>

<!-- Glossary -->
<section class="container-small glossary">
	<h1>Glossary</h1>
	{#each Object.entries(GLOSSARY) as [term, definition]}
		<h2>{formatTerm(term)}</h2>
		<p>{definition}</p>
	{/each}
</section>

<!-- How it Works -->
<section class="container-small how-it-works">
	<h1>How it Works</h1>
	<p>This section will describe the various aspects of the Toucans platform.</p>
	<h3>Multi-Sig Treasury</h3>
	<img src="/multi-sig-hiw.PNG" alt="multi sig how it works" />
	<h3>Funding Rounds</h3>
	<img src="/funding-rounds-hiw.PNG" alt="funding round how it works" />
	<h3>Purchasing During a Funding Rounds</h3>
	<img src="/purchase-hiw.PNG" alt="purchase during a funding round how it works" />
</section>

<style lang="scss">
	section {
		max-width: 65ch;
	}

	section.glossary {
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
	}

	section.risks,
	section.how-it-works {
		h2 {
			font-size: var(--font-size-6);
			margin-block: var(--space-10) var(--space-2);
		}

		h3 {
			font-size: var(--font-size-3);
			margin-block: var(--space-8) var(--space-1);
		}

		p {
			margin-top: 10px;
			margin-bottom: 10px;
		}
	}
</style>
