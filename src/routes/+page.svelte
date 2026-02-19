<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import grassTex from '$lib/assets/textures/grassTexture_1.png';
	import ShowHouse from '$lib/components/ShowHouse.svelte';

	let svgEl: SVGSVGElement;
	let isShowingHouse = $state(false);
	let currentHouse = $state("");
	let house = $state({
		"c": {
			"color": "transparent",
			"id": "c"
		}
	});

	function updateViewBox(pad = 80) {
		if (!svgEl || !svgEl.firstElementChild) return;

		const bb = svgEl.getBBox();
		const x = bb.x - pad;
		const y = bb.y - pad;
		const w = bb.width + pad * 2;
		const h = bb.height + pad * 2;

		svgEl.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
	}

	onMount(() => {
		let alive = true;
		let queued = false;

		const schedule = () => {
			if (queued) return;
			queued = true;
			requestAnimationFrame(() => {
				queued = false;
				tick().then(() => {
					if (!alive) return;
					updateViewBox();
				});
			});
		};

		const mo = new MutationObserver(schedule);
		mo.observe(svgEl, {
			childList: true,
			subtree: true,
			attributes: false
		});

		// initial
		schedule();

		return () => {
			alive = false;
			mo.disconnect();
		};
	});
	
	function enter(name: string) {
		house.c.color = "red";
		console.log("hover:", name);
	}
	function leave(name: string) {
		house.c.color = "transparent";
		console.log("leave:", name);
	}
	function show(id: string) {
		if (!isShowingHouse) {
			isShowingHouse = true;
			currentHouse = id;
			console.log("show:", id);
		} else {
			isShowingHouse = false;
			currentHouse = id;
			console.log("show:", id);
		}
	}
</script>

<svg bind:this={svgEl} width="100%" height="100%" style="overflow: visible;">
	<rect width="100%" height="100%" fill="#8CA5CB"/>

	<!-- Textures -->
	<defs>
		<pattern id="grassTex" patternUnits="userSpaceOnUse" width="25" height="25">
			<image
				href={grassTex}
				width="25"
				height="25"
				preserveAspectRatio="none"
			/>
		</pattern>
	</defs>


	<rect x="10" y="10" width="200" height="100" stroke="red" stroke-width="6" fill="blue" />

	<!-- Island 18 - Sableharbor -->
	<g transform={`translate(1000 1000)`}>		
		<path
			d="M3719.92 120.584C4367.4 263.491 8612.28 1130.68 9438.48 1224.49C10267.8 1318.66 11307.6 1582.26 12183.4 1796.79C13059.2 2011.32 13736.1 2255.44 14137.5 2428.94C14538.8 2602.45 14673.8 2693.05 14767.6 2837.99C14963.2 3140.11 15076 3698.76 14989.6 4392.64C14949.7 4712.75 14901.9 4977.2 14775.6 5209.9C14523.7 5673.76 14222.6 6097.58 13787.3 6340.2C13555.6 6469.32 13278.2 6569.19 12419.2 6613.41C11560.2 6657.62 10162 6646.53 8565.36 6520.94C6968.77 6395.35 5226.56 6162.33 4229.7 6011.52C3232.83 5860.71 2988.7 5794.13 2689.43 5669.38C2390.15 5544.64 2046.15 5367.1 1611.19 4981.08C1176.22 4595.06 665.769 4018.06 381.96 3638.1C98.1498 3258.13 28.6158 3082.11 14.9236 2888.93C-12.8185 2497.54 -11.7989 2126.63 105.716 1830.42C223.241 1534.18 516.129 1166.14 999.515 810.233C1236.08 636.056 1469.11 491.805 1722.83 356.8C1976.54 221.796 2242.86 99.7369 2518.94 38.7075C2795.01 -22.3219 3072.44 -22.3219 3719.92 120.584Z" 
			fill="#7FBF73"
		/>
		<path
			d="M3719.92 120.584C4367.4 263.491 8612.28 1130.68 9438.48 1224.49C10267.8 1318.66 11307.6 1582.26 12183.4 1796.79C13059.2 2011.32 13736.1 2255.44 14137.5 2428.94C14538.8 2602.45 14673.8 2693.05 14767.6 2837.99C14963.2 3140.11 15076 3698.76 14989.6 4392.64C14949.7 4712.75 14901.9 4977.2 14775.6 5209.9C14523.7 5673.76 14222.6 6097.58 13787.3 6340.2C13555.6 6469.32 13278.2 6569.19 12419.2 6613.41C11560.2 6657.62 10162 6646.53 8565.36 6520.94C6968.77 6395.35 5226.56 6162.33 4229.7 6011.52C3232.83 5860.71 2988.7 5794.13 2689.43 5669.38C2390.15 5544.64 2046.15 5367.1 1611.19 4981.08C1176.22 4595.06 665.769 4018.06 381.96 3638.1C98.1498 3258.13 28.6158 3082.11 14.9236 2888.93C-12.8185 2497.54 -11.7989 2126.63 105.716 1830.42C223.241 1534.18 516.129 1166.14 999.515 810.233C1236.08 636.056 1469.11 491.805 1722.83 356.8C1976.54 221.796 2242.86 99.7369 2518.94 38.7075C2795.01 -22.3219 3072.44 -22.3219 3719.92 120.584Z" 
			fill="url(#grassTex)"
			opacity="0.40"
			style="mix-blend-mode: multiply;"
		/>
		<g transform={`translate(800 1000)`}>
			<!-- Background -->
			<rect 
				width="10"
				height="15"
				fill="#705B4E"
				stroke="black"
				stroke-width="0.2"
			/>

			<!-- Roof -->
			<rect 
				width="5" 
				height="15"
				fill="#755F50"
			/>
			<rect 
				x="5"
				width="5" 
				height="15"
				fill="#7B6454"
			/>
		</g>
		<g transform={`translate(820 1000)`}>
			<!-- Background -->
			<rect 
				width="10"
				height="15"
				fill="#705B4E"
				stroke="black"
				stroke-width="0.2"
			/>

			<!-- Roof -->
			<polygon 
				points="0,0 0,15 5,7.5"
				fill="#705B4E"
			/>
			<polygon 
				points="0,0 10,0 5,7.6"
				fill="#725D50"
			/>
			<polygon
				points="10,0 10,15 5,7.5"
				fill="#786254"
			/>
			<polygon 
				points="0,15 10,15 5,7.5"
				fill="#766052"
			/>
		</g>
		<g 
			transform={`translate(840 1000)`}
			style="cursor: pointer;"
			pointer-events="all"
			onmouseenter={() => enter('c')}
			onmouseleave={() => leave('c')}
		>
			<!-- Background --> <rect 
				width="10"
				height="15"
				fill="#705B4E"
				stroke="black"
				stroke-width="0.2"
			/>
			<!-- Background --> <rect 
				width="10"
				height="15"
				fill="#705B4E"
				stroke={house.c.color}
				stroke-width="1"
			/>
			<!-- Roof top --> <polygon 
				points="0,0 10,0 5,7.5"
				fill="#725D50"
			/>
			<!-- Roof bottom --> <polygon 
				points="0,15 10,15 5,7.5"
				fill="#766052"
			/>
			<!-- Roof left --> <polygon 
				points="0,0 0,15 5,10 5,5"
				fill="#705B4E"
			/>
			<!-- Roof right --> <polygon 
				points="10,0 10,15 5,10 5,5"
				fill="#786254"
			/>
			<rect
				width="10" 
				height="15"
				fill="transparent"
				pointer-events="all"
				onpointerdowncapture={() => show('c')}
			/>
		</g>
	</g>
</svg>

{#if isShowingHouse}
	<ShowHouse house={currentHouse}/>
{/if}