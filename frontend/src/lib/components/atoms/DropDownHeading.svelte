<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { CommunityDao, FinancialDao } from "$lib/types/dao-project.interface";
	import { getContext } from "svelte";

  export let value: number;
  export let name: string;
  export let headings: string[];

  let dropDown: HTMLDivElement;
  let headingWrapper: HTMLDivElement;

  let displayDropDown = false;

  const handleClick = () => {
    displayDropDown = !displayDropDown;
  };

  const handleWindowClick = (e: MouseEvent) => {
    if (dropDown && !dropDown.contains(e.target as Node) && !headingWrapper.contains(e.target as Node)) {
      displayDropDown = false;
    }
  };

  $: value && (displayDropDown = false);
</script>

<svelte:window on:click={handleWindowClick}/>
<div class="main-wrapper">
  <div class="heading-wrapper row-2 align-center" bind:this={headingWrapper} on:click={handleClick}>
    <h1 class="h3">
      {headings[value]}
    </h1>
    <div class="icon-wrapper" class:selected={displayDropDown}>
      <Icon icon="tabler:chevron-down" width="1.2rem" />
    </div>
  </div>
  {#if displayDropDown}
    <div class="drop-down" bind:this={dropDown} transition:fly|local={{ y: 15, duration: 400 }}>
      <ul>
        {#each headings as heading, index}
          {#if index !== value}
            <li>
              <a class="header-link" href="" on:click={() => (value = index)}>
                {heading}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style type="scss">
  .main-wrapper {
    position: relative;

    .heading-wrapper {
      cursor: pointer;

      h1 {
        font-weight: var(--font-weight-regular);
      }

      .icon-wrapper {
        transition: 0.2s;
        width: 1.2rem;
        height: 1.2rem;
        margin-top: var(--space-2);

        &.selected {
          transform: rotate(180deg);
        }
      }
    }

    .drop-down {
      position: absolute;
      top: 2.9rem;
      left: 0;
      width: fit-content;
      min-width: 180px;
      background-color: var(--clr-surface-primary);
      border-radius: var(--radius-2);

      border-radius: var(--radius-1);
      z-index: 1;

      ul {
        list-style: none;
        padding: var(--space-2) 0;
        margin: 0;

        li {
          padding: var(--space-2) var(--space-6);
        }
      }
    }
  }
</style>
