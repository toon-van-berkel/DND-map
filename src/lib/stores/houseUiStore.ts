import { writable } from 'svelte/store';

export type HouseUiState = {
	isShowingHouse: boolean;
	currentHouse: string | null;
	hoveredHouse: string | null;
};

const initial: HouseUiState = {
	isShowingHouse: false,
	currentHouse: null,
	hoveredHouse: null
};

function createHouseUiStore() {
	const { subscribe, set, update } = writable<HouseUiState>(initial);

	return {
		subscribe,

		reset: () => set(initial),

		open: (id: string) =>
			update((s) => ({
				...s,
				isShowingHouse: true,
				currentHouse: id
			})),

		close: () =>
			update((s) => ({
				...s,
				isShowingHouse: false,
				currentHouse: null
			})),

		toggle: (id: string) =>
			update((s) => {
				const same = s.currentHouse === id;
				const open = s.isShowingHouse && same;

				return open
					? { ...s, isShowingHouse: false, currentHouse: null }
					: { ...s, isShowingHouse: true, currentHouse: id };
			}),

		setHover: (id: string | null) =>
			update((s) => ({
				...s,
				hoveredHouse: id
			}))
	};
}

export const houseUi = createHouseUiStore();