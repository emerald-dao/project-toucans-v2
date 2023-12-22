<script lang="ts">
	import Icon from "@iconify/svelte";

    export let name: string
    export let icon: string
</script>

<span class="content" >
        <Icon icon={icon} height="44px" style=" vertical-align:text-bottom; padding-right:10px;"/>
        {name}
 </span>


<style lang="scss">
    .content {
        display: flex;
        width: fit-content;
        color: white;
        padding: 8px;
        align-items: center;
        border-style: solid;
        background-color: #1F1E1E;
        border-radius: 8px;
        border-color: #1F1E1E;
        font-size: 1.0rem;
        @include mq('small'){
            font-size: 26px;
        }
    }
</style>