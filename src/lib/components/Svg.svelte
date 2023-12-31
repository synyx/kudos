<script lang="ts">
	import { getStroke } from 'perfect-freehand';
	import type { StrokeOptionsWithColor, Strokes } from '$lib/utils/types';

	export let svgActive: boolean;
	export let initialStrokes: Strokes = [];
	export let renderFormField = false;
	export let strokeOptions: StrokeOptionsWithColor | null = null;
	export let animate = false;

	export const clear = () => {
		points = [];
		strokesHistory.unshift([]);
		strokes = [];
	};

	export const undo = () => {
		strokeHistoryId = strokeHistoryId >= strokesHistory.length - 1 ? strokesHistory.length - 1 : strokeHistoryId + 1;
		const undoStrokes = strokesHistory[strokeHistoryId];
		if (undoStrokes) {
			strokes = [...undoStrokes];
		}
	};

	export const redo = () => {
		strokeHistoryId = strokeHistoryId > 0 ? strokeHistoryId - 1 : strokeHistoryId;
		const redoStrokes = strokesHistory[strokeHistoryId];
		if (redoStrokes) {
			strokes = [...redoStrokes];
		}
	};

	let svgElement: SVGElement;

	export let strokes: Strokes = initialStrokes;
	let strokesHistory: Strokes[] = [[]];
	let strokeHistoryId = 0;
	let points: number[][] = [];

	const viewBoxWidth = 520;
	const viewBoxHeight = 200;

	$: stroke = strokeOptions ? getStroke(points, strokeOptions) : [];
	$: pathData = getSvgPathFromStroke(stroke);
	$: strokesJson = JSON.stringify(strokes);
	$: if (animate) {
		setTimeout(() => animateSvg(), 0);
	}

	function getPoint(
		e:
			| PointerEvent
			| (TouchEvent & {
					currentTarget: EventTarget & SVGSVGElement;
			  }),
	) {
		const rect = svgElement.getBoundingClientRect();
		const svgOffsetX = rect.left;
		const svgOffsetY = rect.top;

		const svgWidth = rect.width;
		const svgHeight = rect.height;

		const clientX = e instanceof PointerEvent ? e.clientX : e.touches[0].clientX;
		const clientY = e instanceof PointerEvent ? e.clientY : e.touches[0].clientY;
		const pressure = e instanceof PointerEvent ? e.pressure : e.touches[0].force;

		const x = ((clientX - svgOffsetX) / svgWidth) * viewBoxWidth;
		const y = ((clientY - svgOffsetY) / svgHeight) * viewBoxHeight;

		return [x, y, pressure];
	}

	function handlePointerDown(e: PointerEvent) {
		svgElement.setPointerCapture(e.pointerId);
		points = [getPoint(e)];
	}

	function handlePointerUp() {
		if (!strokeOptions) {
			console.error('strokeOptions not set');

			return;
		}
		strokes = [...strokes, { strokeOptions: { ...strokeOptions }, points }];
		if (strokeHistoryId > 0) {
			strokesHistory.splice(0, strokeHistoryId);
			strokeHistoryId = 0;
		}
		strokesHistory.unshift([...strokes]);
		points = [];
	}

	function handlePointerMove(
		e:
			| PointerEvent
			| (TouchEvent & {
					currentTarget: EventTarget & SVGSVGElement;
			  }),
	) {
		if (e instanceof PointerEvent) {
			if (e.buttons !== 1) return;
		}

		points = [...points, getPoint(e)];
	}

	function average(a: number, b: number) {
		return (a + b) / 2;
	}

	function getSvgPathFromStroke(points: number[][], closed = true) {
		const len = points.length;

		if (len < 4) {
			return ``;
		}

		let a = points[0];
		let b = points[1];
		const c = points[2];

		let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(
			b[0],
			c[0],
		).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

		for (let i = 2, max = len - 1; i < max; i++) {
			a = points[i];
			b = points[i + 1];
			result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
		}

		if (closed) {
			result += 'Z';
		}

		return result;
	}

	function animateSvg() {
		if (animate && svgElement) {
			const paths = [...svgElement.querySelectorAll('path')] as SVGPathElement[];

			for (const path of paths) {
				const length = Math.ceil(path.getTotalLength());
				path.style.strokeDasharray = `${length}`;
				path.style.strokeDashoffset = `${length}`;
			}
		}
	}
</script>

<div
	class="canvas-wrapper h-full absolute top-0 left-0 {svgActive
		? 'border-2 border-dashed border-gray-600'
		: 'pointer-events-none'}"
>
	<svg
		class="w-full h-full"
		viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
		preserveAspectRatio="none"
		bind:this={svgElement}
		on:pointerdown={handlePointerDown}
		on:pointerup={handlePointerUp}
		on:touchend|preventDefault={handlePointerUp}
		on:pointermove={handlePointerMove}
		on:touchmove|preventDefault={handlePointerMove}
		style="touchAction: 'none'"
	>
		{#if animate}
			{#each strokes as stroke, i}
				<path
					class="animated"
					stroke={stroke.strokeOptions.colorFill}
					stroke-width="5"
					stroke-opacity={stroke.strokeOptions.colorFill}
					style={`opacity: 0;
							fill-opacity: ${stroke.strokeOptions.colorFillOpacity};
							fill: ${stroke.strokeOptions.colorFill};
							animation-delay: ${Math.min(i * 100, 1000)}ms;
							`}
					d={getSvgPathFromStroke(getStroke(stroke.points, stroke.strokeOptions))}
				/>
			{/each}
		{:else}
			{#each strokes as stroke}
				<path
					fill={stroke.strokeOptions.colorFill}
					fill-opacity={stroke.strokeOptions.colorFillOpacity}
					d={getSvgPathFromStroke(getStroke(stroke.points, stroke.strokeOptions))}
				/>
			{/each}
		{/if}

		{#if strokeOptions}
			<path fill={strokeOptions.colorFill} fill-opacity={strokeOptions.colorFillOpacity} d={pathData} />
		{/if}
	</svg>
	{#if renderFormField}
		<input type="hidden" bind:value={strokesJson} name="img" />
	{/if}
</div>

<style lang="scss">
	.canvas-wrapper {
		width: 100%;
		height: 100%;
	}

	path.animated {
		animation: sign ease 4s;
		animation-fill-mode: forwards;
	}

	@keyframes sign {
		0% {
			opacity: 0;
			fill-opacity: 0;
		}
		5% {
			opacity: 1;
			fill-opacity: 0;
		}
		55% {
			opacity: 1;
			stroke-dashoffset: 0;
			stroke-opacity: 1;
			fill-opacity: 0;
		}
		100% {
			opacity: 1;
			stroke-opacity: 0;
			stroke-dashoffset: 0;
		}
	}
</style>
