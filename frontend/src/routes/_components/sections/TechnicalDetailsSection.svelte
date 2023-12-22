<script lang="ts">
	import Orbits from '$lib/components/Orbits.svelte';

	const TECHNICAL_CARDS = [
		{
			title: 'High-traffic performance',
			description:`
                We chose Flow because it can handle high-traffic applications, making it ideal for processing attendance data at large events. <br><br>

                Also, it’s focus on mainstream adoption make it ideal for building smooth user experiences.
            `},
		{
			title: '<strong>Truly</strong> transparent',
			description:
            'By using blockchain technology all transactions are traced and publicly stored in a decentralized way.'		},
		{
			title: 'Powerful Composability',
			description:
            "Because Toucans is built on the blockchain, our proof of attendance NFTs are truly composable. This means they can be used for much more than just event attendance verification. <br><br>Communities on Discord can use FLOATs to verify attendance and grant certain roles to members. Smart contracts like Toucans can restrict participation in funding rounds to FLOAT owners. With FLOAT, your NFTs can be used in ways limited only by your imagination!"		}
	];
</script>

<section>
	<div class="container-small shadow-medium">
		<div class="center column-10" style="z-index: 10">
			<div class="header-wrapper center column-2">
				<h2 class="w-bold">Transparency and security first</h2>
				<p class="h5">
					We use <strong class="primary">Flow blockchain</strong> technology guarantee full
					<strong>transparency</strong>
					and
					<strong>security</strong>.
				</p>
			</div>
			<div class="cards-wrapper">
				{#each TECHNICAL_CARDS as card, i}
					<div class="techincal-card" style={`grid-area: card${i + 1}`}>
						<h4 class="h5 w-medium">{@html card.title}</h4>
                        {#if i==0}
                            <div style="display:flex; align-items:center; padding-bottom: 4px">
                                <p class="small">Built on</p>
                                <img src="/flow.png" alt="flow logo" style={"padding-left:4px"} height="27px" width="65"/>
                            </div>
                        {/if}
						<p class="small">{@html card.description}</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="orbits-wrapper">
			<Orbits />
		</div>
	</div>
</section>

<style lang="scss">
	.container-small {
		background-color: #222222;
		padding: var(--space-10);
		border-radius: var(--radius-9);
		position: relative;
		overflow: hidden;
		display: flex;
		@include mq(small) {
			padding: var(--space-12);
		}

		@include mq(medium) {
			padding: var(--space-16);
		}

		.orbits-wrapper {
			position: absolute;
			left: 100px;
			top: -200px;
		}

		.header-wrapper {
			h2 {
				text-align: center;
				color: #FFFFFF;
			}

			p.h5 {
				text-align: center;
				color: rgba(#FFFFFF,0.6);

				strong {
					color: #FFFFFF;

					&.primary {
						color: var(--clr-primary-600);
					}
				}
			}
		}

		.cards-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-7);

			@include mq('small') {
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				grid-template-rows: repeat(2, auto);
				grid-template-areas:
					'card1 card1 card1 card2 card2'
					'card3 card3 card3 card3 card3';
			}

			.techincal-card {
				background: linear-gradient(0deg, #313131, #313131),
                            linear-gradient(0deg, #484848, #484848);
                border: 1px solid #484848;
				border-radius: var(--radius-7);
				padding: var(--space-10);
				transition: 2s;

				&:hover {
					h4 {
						color: var(--clr-primary-800);
					}
				}

				h4 {
					color: #FFFFFF;
					margin-bottom: var(--space-3);
					transition: 2s;
                    strong {
                        color: var(--clr-primary-600);
                    }
                    
				}
                .h5{
                    strong {
					    color: var(--clr-primary-600);

					&.primary {
						color: var(--clr-primary-600);
					}
				}
                }
				p {
					color: rgba(#FFFFFF,0.6);
				}
			}
		}
	}
</style>