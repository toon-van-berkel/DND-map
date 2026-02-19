<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import grassTex from '$lib/assets/textures/grassTexture_1.png';
	import { houseUi } from '$lib/stores/houseUiStore';
	import { islandTwo } from '$lib/components/data/shapes';

	let svgEl: SVGSVGElement;

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
		mo.observe(svgEl, { childList: true, subtree: true, attributes: false });

		schedule();

		return () => {
			alive = false;
			mo.disconnect();
		};
	});
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

	<!-- Island 18 - Sableharbor -->
	<g transform={`translate(1000 1000)`}>
		<g>
			<path
				d={islandTwo.one.shape}
				fill={islandTwo.one.fill}
			/>
			<path
				d={islandTwo.one.shape}
				fill="url(#grassTex)"
				opacity="0.40"
				style="mix-blend-mode: multiply;"
			/>
		</g>
		<g 
			transform={`translate(${islandTwo.two.x} ${islandTwo.two.y})`}
			style="cursor: pointer;"
			pointer-events="all"
			onmouseenter={() => houseUi.setHover('it2')}
			onmouseleave={() => houseUi.setHover(null)}
		>
			<path 
				d={islandTwo.two.shape} 
				fill={islandTwo.two.fill}
				stroke={$houseUi.hoveredHouse === 'it2' ? 'red' : 'transparent'}
				stroke-width="1"
			/>
		</g>
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
			onmouseenter={() => houseUi.setHover('a1a1a1a1a1')}
			onmouseleave={() => houseUi.setHover(null)}
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
				stroke={$houseUi.hoveredHouse === 'a1a1a1a1a1' ? 'red' : 'transparent'}
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
				onpointerdowncapture={() => houseUi.toggle('a1a1a1a1a1')}
			/>
		</g>
	</g>
</svg>