<script lang="ts">
	import { Button } from '@emerald-dao/component-library';

</script>

<section class="section-large">
    <div class="container-medium linear-gradient">
        <h1>Ready to give super powers to your community?</h1>
        <p>Unlock transparent funding and governance on the <br>Flow Blockchain.</p>
        <Button color="primary" size="large" width="extended" href="/dao-generator">
            Create your DAO for free in just 5 minutes!
        </Button>
    </div>
</section>

<style lang="scss">
    section {

        .container-medium {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding:60px;
            gap:22px;
            border-radius: 20px;
            border-color: #424242;
            text-align: center;
            border:1px;
            p{
                font-size: 1.3rem;
                line-height: 30px;
            }
            h1{
                font-size: 2.5rem;
            }
            @include mq('small'){
					h1{
						font-size: 70px;
					}
					p{
						font-size: 22px;
						line-height: 30px;
					}
				}
        }
        .linear-gradient {
            background: linear-gradient(180deg, #1E1E1E 50%, #317452 369.36%),
                linear-gradient(0deg, #424242, #424242);
            border-radius: 20px;
            border: 1px solid #424242;
        }
     }
</style>
