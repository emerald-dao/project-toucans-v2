<script type="ts">
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';

	const { form } = createForm({
		onSubmit: (values) => {
			// ...
		}
	});
</script>

<form use:form>
	<label for="dao-name">What should we call this DAO?</label>
	<input
		type="text"
		name="dao-name"
		placeholder="Alpha DAO"
		bind:value={$daoData.daoDetails.name}
	/>
	<label for="token-name">Token name</label>
	<input
		type="text"
		name="token-name"
		placeholder="DAOcoin"
		bind:value={$daoData.daoDetails.tokenName}
	/>
	<label for="description">DAO description</label>
	<input
		type="text"
		name="description"
		placeholder="A DAO for the people"
		bind:value={$daoData.daoDetails.description}
	/>
	<label for="website">Website</label>
	<input
		type="text"
		name="website"
		placeholder="www.alphadao.io"
		bind:value={$daoData.daoDetails.website}
	/>
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
