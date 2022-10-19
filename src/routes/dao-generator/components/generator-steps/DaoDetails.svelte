<script type="ts">
	import Icon from '@iconify/svelte';
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import FormErrors from '$components/forms/FormErrors.svelte';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';

	const schema = yup.object({
		daoName: yup.string().max(20).min(4).required(),
		tokenName: yup.string().max(5).min(2).uppercase().required(),
		description: yup.string().max(200).min(60).required(),
		website: yup
			.string()
			.matches(
				/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
				'Enter a correct URL'
			)
	});

	const { form, touched, errors } = createForm({
		extend: [validator({ schema }), reporter],
		onSubmit() {
			generatorActiveStep.increment();
		}
	});
</script>

<form use:form id={$generatorSteps[$generatorActiveStep].slug}>
	<label for="daoName">What should we call this DAO?</label>
	<input
		type="text"
		name="daoName"
		placeholder="Emerald DAO"
		class:validated={$touched.daoName && $errors.daoName === null}
		class:error={$touched.daoName && $errors.daoName != null}
		bind:value={$daoData.daoDetails.name}
	/>
	<ValidationMessage for="daoName" let:messages={message}>
		<FormErrors {message} />
	</ValidationMessage>

	<label for="tokenName">Token name</label>
	<div class="input-icon-left">
		<div class="icon">
			<Icon icon="tabler:currency-dollar" />
		</div>
		<input
			type="text"
			name="tokenName"
			placeholder="DAOcoin"
			class:validated={$touched.tokenName && $errors.tokenName === null}
			class:error={$touched.tokenName && $errors.tokenName != null}
			bind:value={$daoData.daoDetails.tokenName}
		/>
	</div>
	<ValidationMessage for="tokenName" let:messages={message}>
		<FormErrors {message} />
	</ValidationMessage>

	<label for="description">DAO description</label>
	<textarea
		type="text"
		name="description"
		placeholder="A DAO for the people"
		class:validated={$touched.description && $errors.description === null}
		class:error={$touched.description && $errors.description != null}
		bind:value={$daoData.daoDetails.description}
	/>
	<ValidationMessage for="description" let:messages={message}>
		<FormErrors {message} />
	</ValidationMessage>

	<label for="website">Website</label>
	<div class="input-icon-left">
		<div class="icon">
			<Icon icon="tabler:world" />
		</div>
		<input
			type="text"
			name="website"
			placeholder="www.alphadao.io"
			class:validated={$touched.website && $errors.website === null}
			class:error={$touched.website && $errors.website != null}
			bind:value={$daoData.daoDetails.website}
		/>
	</div>

	<ValidationMessage for="website" let:messages={message}>
		<FormErrors {message} />
	</ValidationMessage>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		input {
			margin-bottom: 0rem;
			position: relative;
		}

		textarea {
			min-height: 15rem;
			font-size: var(--fs-300);
		}
	}
</style>
