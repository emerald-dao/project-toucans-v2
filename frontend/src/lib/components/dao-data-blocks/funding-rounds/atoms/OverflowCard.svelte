<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import HolderClaimModal from '$lib/features/overfund/holder-claim/HolderClaimModal.svelte';

	export let projectId: string;
	export let claimOverflow: boolean;
</script>

<div class="row-3 align-center">
	<div class="row-1 align-center">
		<IconCircle icon="tabler:bell-ringing" />
		<span class="xsmall"> Overfunded </span>
	</div>
	{#if claimOverflow}
		<HolderClaimModal {projectId} />
	{/if}
</div>

<style lang="scss">
	span {
		color: var(--clr-tertiary-main);
	}
</style>
