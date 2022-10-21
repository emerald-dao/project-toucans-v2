<script type="ts">
	import Icon from '@iconify/svelte';
	import FormHelper from '$components/forms/FormHelper.svelte';

	export let name: string;
	export let label: string;
	export let icon: string | null = null;
	export let pending: boolean = false;
	export let pendingMessage: string[] = [];
	export let res;
</script>

<label for={name}>{label}</label>
<div class="input-wrapper">
	{#if icon}
		<div class="icon-wrapper-left solid">
			<Icon {icon} />
		</div>
	{/if}
	<div class="icon-wrapper-right">
		{#if res.getErrors(name).length > 0}
			<Icon icon="tabler:alert-circle" color="var(--clr-alert-main)" />
		{:else if res.isValid(name)}
			<Icon icon="tabler:check" color="var(--clr-success-main)" />
		{:else if pending}
			<Icon icon="tabler:loader" color="var(--clr-secondary-main)" class="rotate" />
		{/if}
	</div>
	<slot />
</div>
<div class="helper-wrapper">
	{#if res.getErrors(name).length > 0}
		<FormHelper message={res.getErrors(name)} type="error" />
	{:else if pending}
		<FormHelper message={pendingMessage} type="loading" />
	{/if}
</div>

<style type="scss">
	.helper-wrapper {
		min-height: 1.9rem;
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}
</style>
