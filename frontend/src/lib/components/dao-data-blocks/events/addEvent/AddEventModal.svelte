<script lang="ts">
	import { Button, InputWrapper, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import validationSuite from './validation';
	import saveEvent from './saveEvent';

	let id = '2344324';

	let eventId: string;

	const handleOpenModal = () => {
		getModal(id).open();

		setTimeout(() => {
			const input = document.getElementById('event-id') as HTMLInputElement;

			input.focus();
		}, 100);
	};

	const handleChange = (input: Event) => {
		res = validationSuite(eventId);
	};

	let res = validationSuite.get();

	let savingEvent = false;

	const handleAddEvent = async () => {
		savingEvent = true;

		const saveResult = await saveEvent(eventId);

		console.log(saveResult);

		savingEvent = false;
	};
</script>

<Button on:click={handleOpenModal} type="ghost" color="neutral" size="x-small">
	Add event
	<Icon icon="tabler:plus" />
</Button>
<Modal {id} background="var(--clr-surface-primary)">
	<div class="modal-wrapper">
		<h4 class="h5">Add event manually</h4>
		<p>
			If your event is missing on the list you can add it manually by providing the transaction id.
		</p>
		<div class="input-wrapper">
			<InputWrapper
				name="event-id"
				isValid={res.isValid('event-id')}
				errors={res.getErrors('event-id')}
				label="Event ID *"
			>
				<input
					type="text"
					id="event-id"
					name="event-id"
					placeholder="2c1ea8618b8cf53d9af25e32a22d433981ada8113ce96cb2a1ec35ce3361fc47"
					maxlength="64"
					bind:value={eventId}
					on:input={handleChange}
				/>
			</InputWrapper>
		</div>
		<Button
			on:click={handleAddEvent}
			width="extended"
			state={savingEvent ? 'loading' : res.isValid() ? 'active' : 'disabled'}
		>
			<Icon icon="tabler:plus" />
			Add event
		</Button>
	</div>
</Modal>

<style lang="scss">
	.modal-wrapper {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		p {
			margin-bottom: var(--space-6);
			max-width: 60ch;
		}

		.input-wrapper {
			margin-bottom: var(--space-4);
		}
	}
</style>
