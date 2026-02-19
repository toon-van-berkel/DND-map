<script lang="ts">
    import { base } from '$app/paths';
	import { houseUi } from '$lib/stores/houseUiStore';
	import { houses } from '$lib/stores/information/houses/houses';

	let { house } = $props<{ house: string }>();

	const houseData = $derived(house ? houses[house] : null);

	const houseModules = import.meta.glob('$lib/components/houses/*.svelte');
	let HouseComponent: any = $state(null);

	// $effect(() => {
	// 	let cancelled = false;

	// 	HouseComponent = null;
	// 	if (!house) return;

	// 	const key = `/src/lib/components/houses/${house}.svelte`;
	// 	const loader = houseModules[key];

	// 	if (!loader) return;

	// 	(async () => {
	// 		try {
	// 			const mod: any = await loader();
	// 			if (!cancelled) HouseComponent = mod.default;
	// 		} catch {
	// 			if (!cancelled) HouseComponent = null;
	// 		}
	// 	})();

	// 	return () => {
	// 		cancelled = true;
	// 	};
	// });
</script>

{#if house}
	<div class="view" role="dialog" aria-modal="true">
		<div class="view__bar">
			<h2 class="view__title">
				House {houseData?.id ?? `Unknown house (${house})`}
			</h2>

			<button class="view__close" onclick={() => houseUi.close()}>✕</button>
		</div>

		{#if houseData}
			<div class="view__content">
                <p><b>Possible NPC's:</b> 
                    <span class="muted"><a href="{base}/">Jack</a>, <a href="{base}/">Michelle</a></span></p>
			</div>

            <div class="view__map">
                <img class="view__map__image" src="{base}/assets/maps/{houseData.id}.jpg" alt="{houseData.id}">
            </div>
            <!-- {#if HouseComponent}
                <div class="view__map">
                    <HouseComponent />
                </div>
            {:else}
                <p>No component for house: {house}</p>
            {/if} -->
		{:else}
			<p class="muted">No data found for this house id.</p>
		{/if}
	</div>
{/if}

<style lang="scss">
	.view {
		padding: 15px;
		position: absolute;
        height: 90%;
		right: 12px;
		bottom: 12px;
		left: 224px;

		background: rgba(0, 0, 0, 0.55);
		color: white;
		z-index: 49;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.view__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.view__title {
		margin: 0;
		font-size: 18px;
	}

	.view__close {
		cursor: pointer;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		border-radius: 10px;
		padding: 6px 10px;
	}

	.view__content {
		display: flex;
		flex-direction: column;
	}

    .view__map {
        width: 100%;
        overflow-x: scroll;
    }
    .view__map__image {
        height: 800px;
    }

	.muted {
		opacity: 0.65;
	}

    a {
        color: yellow;
    }
</style>
