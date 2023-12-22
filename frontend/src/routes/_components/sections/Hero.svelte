<script type="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import { Button } from '@emerald-dao/component-library';
	import CirclesAndBlur from './atoms/CirclesAndBlur.svelte';
	import BorderColoredText from './atoms/BorderColoredText.svelte';
</script>

<section class="section-large">
	<div class="container-medium">
		<div class="title-wrapper">
			<div style="padding-bottom: 50px;">
				<BorderColoredText text={"No-code dao generator"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"}/>
			</div>
			<h3>Empower your community</h3>
			<h1 class="w-medium">Funding and governance redefined</h1>
			<p class="w-medium">
				Create a 
				<BorderColoredText fontSize={"16px"} borderColor={"#808080"} padding={"6px"} text={"Token"} color={"#FFFFFF"} backgroundColor={"#000000"} borderRadius={"8px"} icon={"noto:coin"}/> . 
				Unlock transparent <BorderColoredText fontSize={"16px"} borderColor={"#808080"} padding={"6px"} text={"Fundraising"} color={"#FFFFFF"} backgroundColor={"#000000"} borderRadius={"8px"} icon={"noto:coin"}/>
				 and <BorderColoredText fontSize={"16px"} borderColor={"#808080"} padding={"6px"} text={"Voting"} color={"#FFFFFF"} backgroundColor={"#000000"} borderRadius={"8px"} icon={"game-icons:vote"}/> . 
				 Manage funds thorough a secure <BorderColoredText borderColor={"#808080"} fontSize={"16px"} padding={"6px"} text={"multisig threasury"} color={"#FFFFFF"}  backgroundColor={"#000000"} borderRadius={"8px"} icon={"noto:money-bag"}/> .
			</p>
		</div>
		<div class="w-medium button-container" style={"padding-top: 50px;"} >
			<Button color="neutral" type="ghost" size="large" width="extended" href="/discover">
				Explore
			</Button>
			<Button color="primary" size="large" width="extended" href="/dao-generator">
				Create DAO
			</Button>
		</div>
	</div>
</section>
<style type="scss">
    section {

        .container-medium {
            display: flex;
            flex-direction: column;
            align-items: center;

            .title-wrapper {
                text-align: center;

                h1 {
					font-size: 2.5rem;
                    margin-bottom: var(--space-6) 0;
                    padding-bottom: 20px;
                }

                h3 {
					font-size: 1.8rem;
                    margin-bottom: var(--space-4) 0;
                }
				
                p {
                    line-height: 1.6;
                    font-size: 1.3rem;
                    max-width: 80ch;
                }
				@include mq('small'){
					h1{
						font-size: 70px;
					}
					h3{
						font-size: 45px;
					}
					p{
						font-size: 27px;
						line-height: 2;
					}
				}
				
            }
			.button-container {
                display: flex;
				flex-direction: column;
                align-items: center;
                gap: var(--space-2);
				@include mq('small'){
					flex-direction: row; 
					gap:10px;
				}
            }
            
        }
    }
</style>
