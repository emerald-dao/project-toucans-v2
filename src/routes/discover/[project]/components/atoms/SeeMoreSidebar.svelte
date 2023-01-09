<script type="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="sidebar-wrapper" transition:fly|local={{ x: 10, duration: 200 }}>
	<div class="button" on:click={() => dispatch('closeModal')} on:keydown>
		<p class="xsmall w-medium">Close</p>
	</div>
	<div class="data-wrapper">
		<h3 class="heading w-bold">Story</h3>
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus, rem sapiente culpa sequi
			laudantium fugit modi! Necessitatibus blanditiis sequi hic rerum quo dolore, quos, vel modi
			numquam pariatur magni ipsum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
			voluptatibus ipsam! Quo eius aut sit sint, voluptatibus laboriosam ad doloribus obcaecati
			ipsam ducimus suscipit sapiente, voluptate iste doloremque! Vel, eaque. Lorem ipsum dolor sit
			amet consectetur adipisicing elit. Commodi ullam saepe, vero quasi, dolores illo veniam sunt
			rerum facere asperiores dolorum natus minima vel! Amet sed ipsum corrupti at saepe! Lorem
			ipsum dolor sit amet consectetur adipisicing elit. Possimus, debitis! Quos quasi, quae facilis
			deserunt voluptatem ex, ut cumque quidem magnam voluptates labore sed dolores, vel saepe
			ratione blanditiis quisquam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
			Obcaecati ducimus eligendi suscipit voluptas non amet, modi magni consectetur iste ab,
			blanditiis voluptates culpa officia cupiditate odio sequi illum odit enim. lore
		</p>
	</div>
</div>

<style type="scss">
	.sidebar-wrapper {
		position: fixed;
		top: 0;
		right: 0;
		height: 100%;
		width: 100vw;
		z-index: 99;
		display: flex;
		flex-direction: column;
		background: var(--clr-surface-primary);

		@include mq(medium) {
			width: 30vw;
		}

		.button {
			align-self: flex-end;
			margin: var(--space-5);
			padding: var(--space-2) var(--space-4);
			border: solid 1px var(--clr-tertiary-main);
			border-radius: var(--radius-1);
			cursor: pointer;
			p {
				color: var(--clr-tertiary-main);
			}
		}

		.data-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: var(--space-10);
			gap: var(--space-10);
		}
	}
</style>
