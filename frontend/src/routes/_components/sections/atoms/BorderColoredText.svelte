<script lang="ts">
	import Icon from "@iconify/svelte";

    export let text: string;
    export let fontSize: string = "10px"
    export let borderColor: string = "FF66C4"
    export let icon: string = "";
    export let color: string;
    export let borderRadius: string = "8px";
    export let backgroundColor: string = "#FF66C4";
    export let padding: string = "40px";

    let rgaBackgroundColor = hexToRGBA(backgroundColor);
    let style = `font-size:0.9rem; color:${color}; border-color: ${borderColor}; border-radius: ${borderRadius}; background-color: rgba(${rgaBackgroundColor},0.2); padding-right: ${padding}; padding-left:${padding}; @include mq('small'){ font-size:${fontSize}}};`;

    function hexToRGBA(hex: string) {
        let bigint = parseInt(hex.substring(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return `${r},${g},${b}`;
    }
</script>
{#if icon ==""}
    <span class="tagline coloredBorder" style={`${style}`}>{text}</span>
{:else}
    <span class="tagline coloredBorder" style={`${style}  align-items: center; padding:5px; padding-top: 6px;`}>
        <Icon icon={icon} height="22px" style=" vertical-align:text-bottom;"/>
        {text}
    </span>
{/if}
<style lang="scss">
        .coloredBorder {
            align-items: center;
            border-width: 1px;  
            border-style: solid;
            padding: 5px;
            max-width: fit-content;
            white-space: nowrap;
        }
    
</style>