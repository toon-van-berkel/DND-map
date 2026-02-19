<script lang="ts">
    import { base } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy, tick } from 'svelte';
	import MapViewport from '$lib/components/MapViewport.svelte';
	import ShowHouse from '$lib/components/ShowHouse.svelte';
	import { mapViewport } from '$lib/stores/mapViewportStore';
	import { houseUi } from '$lib/stores/houseUiStore';

	let { children: page } = $props() as { children: Snippet };
	let mapHost: HTMLElement;
	let mapRect = $state({ left: 0, top: 0, width: 0, height: 0 });
	let cursor = $state({ x: 0, y: 0, inside: false });
	let center = $state({ x: 0, y: 0 });

	function updateRect() {
		if (!mapHost) return;
		const r = mapHost.getBoundingClientRect();
		mapRect.left = r.left;
		mapRect.top = r.top;
		mapRect.width = r.width;
		mapRect.height = r.height;
	}

	function localToWorld(localX: number, localY: number) {
		return {
			x: $mapViewport.x + localX / $mapViewport.scale,
			y: $mapViewport.y + localY / $mapViewport.scale
		};
	}

	function handlePointerMove(e: PointerEvent) {
		const lx = e.clientX - mapRect.left;
		const ly = e.clientY - mapRect.top;

		cursor.inside = lx >= 0 && ly >= 0 && lx <= mapRect.width && ly <= mapRect.height;

		const w = localToWorld(lx, ly);
		cursor.x = w.x;
		cursor.y = w.y;
	}

	function handlePointerLeave() {
		cursor.inside = false;
	}

	onMount(async () => {
		await tick();
		updateRect();

		const onScroll = () => updateRect();

		window.addEventListener('resize', updateRect, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true, capture: true });

		const ro = new ResizeObserver(() => updateRect());
		if (mapHost) ro.observe(mapHost);

		onDestroy(() => {
			window.removeEventListener('resize', updateRect);
			window.removeEventListener('scroll', onScroll, true as any);
			ro.disconnect();
		});
	});

	$effect(() => {
		const cx = mapRect.width / 2;
		const cy = mapRect.height / 2;
		const w = localToWorld(cx, cy);
		center.x = w.x;
		center.y = w.y;
	});
</script>

<div class="screen">
	<nav class="hud">
		<div class="hud__stats">
			<div class="hud__block">
				<div class="hud__title">Viewport</div>
				<div>
					X: {Math.round($mapViewport.x)} | Y: {Math.round($mapViewport.y)}
				</div>
			</div>

			<div class="hud__block">
				<div class="hud__title">Center</div>
				<div>X: {Math.round(center.x)} | Y: {Math.round(center.y)}</div>
			</div>

			<div class="hud__block">
				<div class="hud__title">Cursor</div>
				<div class:muted={!cursor.inside}>
					X: {Math.round(cursor.x)} | Y: {Math.round(cursor.y)}
				</div>
			</div>

			<div class="hud__block">
				<div class="hud__title">Zoom</div>
				<div>Zoom: {$mapViewport.scale.toFixed(2)}</div>
			</div>

			<div class="hud__block">
				<div class="hud__title">Actions</div>
				<button onclick={() => mapViewport.panBy(100, 0)}>Pan ←</button>
				<button onclick={() => mapViewport.panBy(-100, 0)}>Pan →</button>
				<button onclick={() => mapViewport.zoomBy(1.2)}>Zoom +</button>
				<button onclick={() => mapViewport.zoomBy(1 / 1.2)}>Zoom -</button>
				<button onclick={() => mapViewport.reset()}>Reset</button>
			</div>
		</div>

		<div class="hud__stats">
			<div class="hud__block">
				<div class="hud__title">Overview</div>
				<ul class="hud__list">
					<li class="hud__list__item">
						<a href="{base}/">Characters</a></li>
					<li class="hud__list__item">
						<a href="{base}/">Locations</a></li>
					<li class="hud__list__item">
						<a href="{base}/">Buildings</a></li>
					<li class="hud__list__item">
						<a href="{base}/">Laws</a></li>
					<li class="hud__list__item">
						<a href="{base}/">Weapons & items</a></li>
					<li class="hud__list__item">
						<a href="{base}/">Spells</a></li>
				</ul>
			</div>
		</div>
	</nav>
	<nav class="hud-Top">
		<div class="hud__info">
			<div class="hud__block">
				<div class="hud__title">Information about selection</div>
				<div>This is a quick test</div>
			</div>
		</div>
	</nav>

	<main
		class="screen__map"
		bind:this={mapHost}
		onpointerenter={updateRect}
		onpointermove={handlePointerMove}
		onpointerleave={handlePointerLeave}
	>

		<MapViewport>
			{@render page()}
		</MapViewport>

		{#if $houseUi.isShowingHouse && $houseUi.currentHouse}
			<ShowHouse house={$houseUi.currentHouse} />
		{/if}
	</main>
</div>

<style lang="scss">
	:global(html, body) {
		width: 100%;
		height: 100%;
		margin: 0;
	}

	.screen {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.screen__map {
		position: absolute;
		inset: 0;
	}

	.hud {
		width: 200px;
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 50;
		display: flex;
		flex-direction: column;
		gap: 10px;
		pointer-events: auto;
	}
	.hud-Top {
		position: absolute;
		top: 12px;
		left: 224px;
		right: 12px;
		z-index: 50;
		display: flex;
		flex-direction: column;
		gap: 10px;
		pointer-events: auto;
	}

	.hud__stats {
		display: flex;
		flex-direction: column;
		gap: 10px;

		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(6px);
		padding: 10px 12px;
		border-radius: 12px;
		color: white;
	}

	.hud__title {
		font-size: 12px;
		opacity: 0.75;
		margin-bottom: 2px;
	}

	.muted {
		opacity: 0.45;
	}

	.hud__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hud__list__item {
		&::before {
			content: '- ';
		}
	}

	.hud__info {
        height: 10%;
		display: flex;
		flex-direction: column;
		gap: 10px;

		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(6px);
		padding: 10px 12px;
		border-radius: 12px;
		color: white;
	}

	a {
		color: white;
		text-decoration: none;
	}
</style>
