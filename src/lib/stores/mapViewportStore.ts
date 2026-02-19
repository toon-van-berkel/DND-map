import { writable } from 'svelte/store';

export type Point = { x: number; y: number };
export type MapViewState = {
	x: number;
	y: number;
	scale: number;

	minScale: number;
	maxScale: number;
    
	vpW: number;
	vpH: number;
};

const initial: MapViewState = {
	x: 0,
	y: 0,
	scale: 1,
	minScale: 0.25,
	maxScale: 6000,
	vpW: 0,
	vpH: 0
};

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}
function createMapViewportStore() {
	const { subscribe, set, update } = writable<MapViewState>(initial);

	return {
		subscribe,

		setViewportSize: (w: number, h: number) =>
			update((v) => ({ ...v, vpW: w, vpH: h })),

		reset: () => set(initial),

		setPan: (x: number, y: number) =>
			update((v) => ({ ...v, x, y })),

		panBy: (dx: number, dy: number) =>
			update((v) => ({ ...v, x: v.x + dx, y: v.y + dy })),

		zoomTo: (newScale: number, center?: Point) =>
			update((v) => {
				const old = v.scale;
				const next = clamp(newScale, v.minScale, v.maxScale);
				const c = center ?? { x: v.vpW / 2, y: v.vpH / 2 };

				const k = next / old;
				return {
					...v,
					x: c.x - (c.x - v.x) * k,
					y: c.y - (c.y - v.y) * k,
					scale: next
				};
			}),

		zoomBy: (factor: number, center?: Point) =>
			update((v) => {
				const next = v.scale * factor;
				const old = v.scale;
				const clamped = clamp(next, v.minScale, v.maxScale);
				const c = center ?? { x: v.vpW / 2, y: v.vpH / 2 };

				const k = clamped / old;
				return {
					...v,
					x: c.x - (c.x - v.x) * k,
					y: c.y - (c.y - v.y) * k,
					scale: clamped
				};
			})
	};
}

export const mapViewport = createMapViewportStore();
