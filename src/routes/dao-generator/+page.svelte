<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { Section, Container, Row } from '@mateoroldos/svelte.bones';
	import { activeStep } from '$lib/stores/generator/ActiveStep';
	import { steps } from '$stores/generator/StepsStore';
</script>

<Section>
	<Container>
		<!-- Display generator if user has loggedIn with wallet -->
		<!-- {#if $user?.loggedIn}
      <div class="main-layout">
        <div class="sidebar-container">
          <GeneratorNav bind:step={$activeStep} {steps} />
        </div> -->
		<div class="main-container">
			<svelte:component this={$steps[$activeStep].component} />
			<Row>
				<button on:click={activeStep.decrement}>Previous</button>
				<button on:click={activeStep.increment}>Next</button>
				<button on:click={activeStep.reset}>Reset</button>
			</Row>
		</div>
		<!-- </div> -->
		<!-- If not connected, ask to connect wallet -->
		<!-- {:else}
      <WalletConnectModal />
    {/if} -->
	</Container>
</Section>
