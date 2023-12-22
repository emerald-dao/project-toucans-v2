<script lang="ts">
	import BorderColoredText from "./atoms/BorderColoredText.svelte";
</script>

<section class="section-large">
    <div class="container-medium">
        <h1>A complete toolbox for<br> communities and token creators</h1>
        <p>Unlock transparent funding and governance on the <br>Flow Blockchain.</p>
        <div class="cards-wrapper">
			<div class="techincal-card  with-padding" style={`grid-area: card1`}>
                <BorderColoredText text={"Token"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"} icon={"noto:coin"}/>
                <h3>Fuel your community or idea with a Token</h3>
                <img src="/FlowDevelopersCommunity.png" alt="Flow developers">
			</div>
            <div class="techincal-card with-padding" style={`grid-area: card2`}>
				<BorderColoredText text={"Fundraising"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"} icon={"noto:coin"}/>
                <h3>Crowdfund your <br>dreams</h3>
                <img src="/CrowdfundingYourDreams.png" alt="Flow developers" style="padding-top:50px;">
			</div>
            <div class="techincal-card" style={`grid-area: card3;`}>
				<BorderColoredText text={"Multisig treasury"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"} icon={"noto:money-bag"}/>
                <h3 style={"padding-left:80px; padding-right:80px"}>Store and manage 
                    funds securely.</h3>
                <div class="transaction-image">
                    <img src="/transactions.png" alt="Flow developers" style="margin:1px; width:35%; height:90%" >
                    <img src="/treasuryWallet.png" alt="Flow developers" style="padding-top:70px; padding-bottom:10px;margin-right:1px ;width:55%">
                </div>
			</div>
            <div class="techincal-card with-padding" style={`grid-area: card4;`}>
				<BorderColoredText text={"Voting"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"} icon={"noto:money-bag"}/>
                <h3>Engage in inclusive decision-making 
                    through user-friendly voting.</h3>
                <img src="/Voting.png" alt="Flow developers">
			</div>
    </div>
</section>

<style lang="scss">
    section{
        .container-medium{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap:22px;
            border-radius: 20px;
            border-color: #424242;
            text-align: center;
            border:1px;
            p{
                font-size: 1.3rem;
                line-height: 26px;
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
                line-height: 36px;
                }
            }

            .cards-wrapper {
                display: flex;
                flex-direction: column;
                gap:60px;

			@include mq('small') {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-template-rows: repeat(3, auto);
				grid-template-areas:
					'card1 card1'
					'card2 card3'
                    'card4 card4';
			}
            

			.techincal-card {
                background: linear-gradient(180deg, rgba(255, 102, 196, 0.07) 0%, rgba(18, 18, 18, 0) 100%);
                gap:21px;
                padding-top:40px;
                position: relative;
                border: 1px solid #484848;
				border-radius: var(--radius-7);

                .transaction-image {
                    display: flex;
                    img {
                        align-items: baseline;
                        max-width: 100%;
                        height: auto; 
                        width: 40%;
                    }
                }
                img {
                    display: block;
                    margin: 0 auto;
                    margin-bottom: 1px; 
                    max-width: 100%;
                }

				h3{
                    padding-top: 21px;
                    padding-bottom: 21px;
					color: #FFFFFF;
                    font-size: 24px;
				}

                @include mq('small'){
                    h3{
                        font-size: 36px;
                    }
                }
			}
            .with-padding{
                padding-left:80px;
                padding-right: 80px;
            }
        }
        }
    }
</style>