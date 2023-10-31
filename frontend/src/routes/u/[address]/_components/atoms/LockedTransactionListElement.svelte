<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import { v4 as uuidv4 } from 'uuid';
    import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';
	import { onDestroy, onMount } from 'svelte';
	export let transaction: LockedVaultDetails;
	export let i: number;
    export let projectId: string;

    let now = Math.floor(Date.now() / 1000);
    let unlockTime = parseInt(transaction.unlockTime);
    let secondsToUnlock = unlockTime - now;
    let timeRemaining = formatTime(secondsToUnlock);
    let availableToClaim = false;

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600); 
    const minutes = Math.floor((seconds % 3600) / 60); 
    if (days > 0) {
        return `${days}d`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
    
  }
    function handleTokenClaim(){

    }
  function updateRemainingTime() {
    now = Math.floor(Date.now() / 1000);
    secondsToUnlock = unlockTime - now;
    timeRemaining = formatTime(secondsToUnlock);
    if (secondsToUnlock <= 0) {
      availableToClaim = true;
    }
  }

  const interval = setInterval(updateRemainingTime, 1000);

  onMount(() => {
    updateRemainingTime();
  });

  onDestroy(() => {
    clearInterval(interval);
  });

</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<IconCircle icon="tabler:lock-square" color="alert" />
		<span class="event-name">Locked tokens</span>
	</div>
	<div class="row-3 align-center">
		<div class="dao-label">
			<a class="header-link" href={`/p/${projectId}`}>{projectId}</a>
		</div>
        {#if availableToClaim}
            <Button on:click={handleTokenClaim} size="x-small">Claim</Button>
        {:else}
            <span>{timeRemaining}</span>
        {/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		.timestamp {
			display: unset;
			@media all and (max-width: 700px) {
				display: none;
			}
		}

		.event-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
			margin-right: var(--space-2);
		}

		.info-wrapper {
			margin-right: var(--space-3);

			.date {
				font-size: var(--font-size-0);
				line-height: normal;
				color: var(--clr-text-off);
			}
		}
	}

	.dao-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		color: var(--clr-text-main);
		border: 1px solid var(--clr-border-primary);
		padding: 0px var(--space-3);
		border-radius: 20px;
		width: fit-content;

		.header-link {
			font-size: var(--font-size-0);
		}
	}

	.special-message-heading {
		color: var(--clr-heading-main);
	}

	.special-message {
		max-width: 40ch;
		margin-top: var(--space-2);
	}
</style>
