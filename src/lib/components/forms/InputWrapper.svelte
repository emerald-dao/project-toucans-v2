<script type="ts">
	import Icon from '@iconify/svelte';
	import FormHelper from '$components/forms/FormHelper.svelte';
	import { fly } from 'svelte/transition';

	export let name: string;
	export let label: string | null = null;
	export let icon: string | null = null;
	export let iconUrl: string | null = null;
	export let iconText: string | null = null;
	export let pending: boolean = false;
	export let pendingMessage: string[] = [];
	export let res;
</script>

{#if label}
	<label for={name}>{label}</label>
{/if}
<div class="input-wrapper">
	{#if icon || iconUrl || iconText}
		<div class="icon-wrapper-left solid">
			{#if icon}
				<Icon {icon} />
			{:else if iconUrl}
				<img src={iconUrl} alt="Form helper icon" />
			{:else if iconText}
				<span class="icon-text">{iconText}</span>
			{/if}
		</div>
	{/if}
	{#if res.getErrors(name).length > 0}
		<div class="icon-wrapper-right" in:fly={{ x: 4, duration: 400 }}>
			<Icon icon="tabler:alert-circle" color="var(--clr-alert-main)" />
		</div>
	{:else if res.isValid(name)}
		<div class="icon-wrapper-right" in:fly={{ x: 4, duration: 400 }}>
			<Icon icon="tabler:check" color="var(--clr-success-main)" />
		</div>
	{:else if pending}
		<div class="icon-wrapper-right" in:fly={{ x: 4, duration: 400 }}>
			<Icon icon="tabler:loader-2" color="var(--clr-secondary-main)" class="rotate" />
		</div>
	{/if}
	<slot />
</div>
<div class="helper-wrapper">
	{#if res.getErrors(name).length > 0}
		<FormHelper message={res.getErrors(name)[0]} type="error" />
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
