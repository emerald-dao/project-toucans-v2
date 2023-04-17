<section class="container-small">
	<h1>Risks</h1>
	<h2>Smart Contract Risks</h2>
	<p>
		When a user creates a DAO on the Toucans platform, the fungible token smart contract created is 
		stored in the creator's account.
	</p>
	<p>
		Although we believe this is a huge advantage because it allows users to have full control over
		their contract and gives DAOs independence from our platform, it also means that they can
		directly manipulate the contract.
	</p>
	<i>The following are the main risks related to this.</i>
	<h3>Tokens can be minted even if this feature is turned off</h3>
	<p>
		The project owner can mint tokens even if the minting feature is turned off by updating
		their contract. This can potentially cause inflation and impact the value of tokens.
	</p>
	<p>
		Minting being turned off/on should solely be used as a communication tool from the owner to their
		community that they do not intend to ever mint.
	</p>
	<h3>Total supply updates</h3>
	<p>
		Project administrators can update the total supply at their discretion, which may affect funding
		overflow calculations and impact the value of tokens.
	</p>
	<p>
		This can be done simply by updating the total supply number, or by minting tokens as 
		described above.
	</p>
	<h3>Max supply can be edited</h3>
	<p>
		Project administrators can change the max supply to be a different number, which may affect how
		much they can mint and potentially impact the value of tokens.
	</p>
	<p>
		If there is a max supply present, it should solely be used as a communication tool from the owner 
		to their community that they do not intend to ever mint.
	</p>
</section>

<style lang="scss">
	section {
		max-width: 65ch;

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
