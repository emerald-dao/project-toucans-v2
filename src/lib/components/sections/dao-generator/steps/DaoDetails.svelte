<script type="ts">
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';

	let daoDetails = $daoData.daoDetails;
	const { form } = createForm({
		onSubmit: (values) => {
			// ...
		}
	});
</script>

<form use:form>
	<label for="dao-name">What should we call this DAO?</label>
	<input type="text" name="dao-name" placeholder="Alpha DAO" bind:value={daoDetails.name} />
	<label for="token-name">Token name</label>
	<input type="text" name="token-name" placeholder="DAOcoin" bind:value={daoDetails.tokenName} />
	<label for="description">DAO description</label>
	<input
		type="text"
		name="description"
		placeholder="A DAO for the people"
		bind:value={daoDetails.description}
	/>
	<label for="website">Website</label>
	<input type="text" name="website" placeholder="www.alphadao.io" bind:value={daoDetails.website} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		input {
			margin-bottom: 2rem;
		}
	}
</style>
