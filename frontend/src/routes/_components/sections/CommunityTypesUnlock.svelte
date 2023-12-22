<script lang="ts">
	import CommunityType from "./atoms/CommunityType.svelte";

    let names=["Gaming communities","NFT Collectors", "Meme Coins","Open Source Projects","Educational communities", "Whatever you can imagine!"]

    let icons=["noto:video-game","emojione-v1:octopus","twemoji:see-no-evil-monkey","noto:laptop-computer","noto:graduation-cap","noto:light-bulb"]
</script>

<div class="section-large">
    <div class="container-medium">
        <div class="wrapper">
            <div class="left-wrapper">
                <h1>Unlock the potential of any community</h1>
                <p >Unlock transparent funding and governance on the Flow Blockchain.</p>
            </div>
            <div class="right-wrapper">
                {#each names as name,i }
                    <CommunityType {name} icon={icons[i]}/>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .section-large {
        .container-medium {
            width: min(90%, 72rem);
            margin-inline: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;

            .wrapper {
                gap:88px;
                @include mq('medium') {
                    grid-template-columns: 1fr 1fr;
                    display: grid;
                }
                align-items: center; 
            }

            .left-wrapper {
                max-width: 497px;
                p {
                    font-size: 1.5rem;
                    line-height: 26px;
                    padding-top: 20px;
                    padding-bottom: 20px;

                }
            
                h1{
                    font-size: 2.5rem;
                }
                @include mq('small'){
                    h1{
                        font-size: 70px;
                    }
                    
                    p{
                        font-size: 26px;
                        line-height: 31px;
                    }
                }
            }

            .right-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                @include mq('medium') {
                    margin-top: 0;
                }
            }
        }
    }
</style>
