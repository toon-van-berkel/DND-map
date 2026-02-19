<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { mapViewport, type Point } from '$lib/stores/mapViewportStore';

	type Props = {
		children?: Snippet;
	};
	let props: Props = $props();
	let { children } = props;

	let viewportEl: HTMLDivElement | null = null;

	let dragging = $state(false);
	let pointerId = $state<number | null>(null);
	let startClient = $state<Point>({ x: 0, y: 0 });
	let startPan = $state<Point>({ x: 0, y: 0 });

	function viewportPoint(e: WheelEvent | PointerEvent): Point {
		const r = viewportEl!.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	}

	onMount(() => {
		if (!viewportEl) return;

		const ro = new ResizeObserver(() => {
			mapViewport.setViewportSize(viewportEl!.clientWidth, viewportEl!.clientHeight);
		});
		ro.observe(viewportEl);

		mapViewport.setViewportSize(viewportEl.clientWidth, viewportEl.clientHeight);

		return () => ro.disconnect();
	});

	function onWheel(e: WheelEvent) {
		if (!viewportEl) return;
		e.preventDefault();

		const center = viewportPoint(e);
		const zoomIntensity = 0.0015;
		const factor = Math.exp(-e.deltaY * zoomIntensity);

		mapViewport.zoomBy(factor, center);
	}

	function onPointerDown(e: PointerEvent) {
		if (!viewportEl) return;
		e.preventDefault();

		dragging = true;
		pointerId = e.pointerId;

		startClient = { x: e.clientX, y: e.clientY };

		startPan = { x: $mapViewport.x, y: $mapViewport.y };

		viewportEl.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || pointerId !== e.pointerId) return;

		const dx = e.clientX - startClient.x;
		const dy = e.clientY - startClient.y;

		mapViewport.setPan(startPan.x + dx, startPan.y + dy);
	}

	function endDrag(e: PointerEvent) {
		if (pointerId !== e.pointerId) return;

		dragging = false;
		pointerId = null;

		try {
			viewportEl?.releasePointerCapture(e.pointerId);
		} catch {}
	}
</script>

<div
    class="mapViewport {dragging ? 'isDragging' : ''}"
    bind:this={viewportEl}
    role="application"
    aria-label="Map viewport"
    onwheel={(e) => { e.preventDefault(); onWheel(e); }}
    onpointerdown={(e) => { e.preventDefault(); onPointerDown(e); }}
    onpointermove={onPointerMove}
    onpointerup={endDrag}
    onpointercancel={endDrag}
>
	<div
		class="mapContent"
		style={`transform: translate(${$mapViewport.x}px, ${$mapViewport.y}px) scale(${$mapViewport.scale});`}
	>
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.mapViewport {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		touch-action: none;
		user-select: none;
		cursor: grab;

		&.isDragging {
			cursor: grabbing;
		}
	}

	.mapContent {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
	}

	.controls {
		position: absolute;
		right: 12px;
		top: 12px;
		display: flex;
		gap: 8px;
	}
</style>
