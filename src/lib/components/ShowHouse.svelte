<script>
	let props = $props();
</script>

{#if props.house === ""}
    <div></div>
{:else}
    <div class="test">
        <h1>test - {props.house}</h1>
    </div>
{/if}