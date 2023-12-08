<script lang="ts">
	import BaseKudoCard from './BaseKudoCard.svelte';
	import KudoTitleSelect from './KudoTitleSelect.svelte';
	import { kudoTitles, type KudoTitle, type KudoTitles } from '../utils/kudoTitles';
	import type { Strokes } from '../utils/types';
	import Svg from './Svg.svelte';
	import { drawSettings } from '../utils/stores';
	import Icon from '@iconify/svelte';
	import { SlideToggle, getModalStore, popup } from '@skeletonlabs/skeleton';
	import { confirmed } from '$lib/actions/useButtonConfirmed';

	const modalStore = getModalStore();

	export let initialKudoTitleId: KudoTitles;
	export let initialContent = '';
	export let initialTo = '';
	export let initialFrom = '';
	export let initialStrokes: Strokes = [];

	let clearSvg: () => void;
	export let undoSvg = () => {
		/*noop*/
	};
	export let redoSvg = () => {
		/*noop*/
	};
	export let svgActive: boolean;
	let thinning = 0.5;
	let smoothing = 0.5;
	let streamline = 0.5;

	let kudoTitle: KudoTitle = initialKudoTitleId ? kudoTitles[initialKudoTitleId] : kudoTitles.CONGRATS;

	$: content = initialContent;
	$: to = initialTo;
	$: from = initialFrom;
	$: strokeOptions = {
		size: $drawSettings.size,
		thinning,
		smoothing,
		streamline,
		colorFill: $drawSettings.colorFill,
		colorFillOpacity: $drawSettings.colorFillOpacity,
	};

	export let strokes: Strokes = initialStrokes;
</script>

<div class="flex flex-col space-y-2">
	<BaseKudoCard bind:kudoTitle>
		<KudoTitleSelect slot="title" bind:currentTitle={kudoTitle} />
		<div class="relative h-full" slot="content">
			<input type="hidden" name="kudoTitle" bind:value={kudoTitle.id} />
			<Svg
				bind:clear={clearSvg}
				bind:undo={undoSvg}
				bind:redo={redoSvg}
				{strokeOptions}
				renderFormField={true}
				{svgActive}
				{initialStrokes}
				bind:strokes
			/>
			<textarea
				class="kudo-content w-full max-h-full bg-transparent overflow-hidden resize-none absolute top-0 left-0 {!svgActive
					? ''
					: 'pointer-events-none'} border-0"
				name="content"
				bind:value={content}
				placeholder="<Kudos>"
				rows="8"
			/>
		</div>
		<div slot="to" class="flex space-x-3 items-center">
			<label for="to">Für:</label>
			<input
				bind:value={to}
				class="flex-grow border-solid border-0 border-b-black border-b-2 bg-gray-200"
				type="text"
				name="to"
				id="to"
				placeholder="<Jemand>"
			/>
		</div>
		<div slot="from" class="flex space-x-3 items-center">
			<label for="from">Von:</label>
			<input
				bind:value={from}
				class="flex-grow border-0 border-b-black border-b-2 bg-gray-200"
				type="text"
				name="from"
				id="from"
				placeholder="<Dir>"
			/>
		</div>
	</BaseKudoCard>
	<div
		class="flex flex-row justify-between items-end gap-2 dark:text-white bg-blue-300 dark:bg-blue-900 p-3 rounded-md"
	>
		<div class="flex flex-row justify-center gap-5 h-full">
			<div class="flex flex-col">
				<div
					class="flex justify-center gap-x-2"
					use:popup={{
						event: 'hover',
						target: 'toggleDrawPopup',
						placement: 'left',
					}}
				>
					<label class="cursor-pointer" for="toggleDraw">Malen: </label>
					<SlideToggle id="toggleDraw" name="toggleDraw" class="cursor-pointer" bind:checked={svgActive} />

					<div class="card p-4 variant-filled-secondary" data-popup="toggleDrawPopup">
						<p>{svgActive ? 'Deaktiviere' : 'Aktiviere'} die Leinwand</p>
						<div class="arrow variant-filled-secondary" />
					</div>
				</div>
				<hr class="my-3" />
				<div class="controls-wrapper {svgActive ? 'active' : ''}">
					<div class="flex flex-row space-x-2 mt-2">
						<button
							class="btn grow"
							id="undo"
							on:click|preventDefault={undoSvg}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'undoPopup',
								placement: 'left',
							}}><Icon icon="mdi:undo" /></button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="undoPopup">
							<p>Rückgängig / Undo <kbd class="kbd">STRG + Z</kbd></p>
							<div class="arrow variant-filled-secondary" />
						</div>

						<button
							class="btn grow"
							id="redo"
							on:click|preventDefault={redoSvg}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'redoPopup',
								placement: 'right',
							}}><Icon icon="mdi:redo" /></button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="redoPopup">
							<p>Wiederholen / Redo <kbd class="kbd">STRG + SHIFT + Z</kbd>, <kbd class="kbd">STRG + Y</kbd></p>
							<div class="arrow variant-filled-secondary" />
						</div>
					</div>
					<hr class="my-3" />
					<div>
						<label for="color">Farbe: </label>
						<input
							id="color"
							bind:value={$drawSettings.colorFill}
							type="color"
							class="w-full h-5 rounded-lg {svgActive ? 'cursor-pointer' : 'cursor-not-allowed'}"
							disabled={!svgActive}
						/>
					</div>
					<div>
						<label for="size">Größe:</label>
						<input
							id="size"
							type="range"
							min="1"
							max="32"
							step="1"
							bind:value={$drawSettings.size}
							class="w-full {svgActive ? 'cursor-pointer' : 'cursor-not-allowed'}"
							disabled={!svgActive}
						/>
					</div>
					<div>
						<label for="opacity">Deckkraft:</label>
						<input
							id="opacity"
							type="range"
							min="0"
							max="1"
							step="0.01"
							bind:value={$drawSettings.colorFillOpacity}
							class="w-full {svgActive ? 'cursor-pointer' : 'cursor-not-allowed'}"
							disabled={!svgActive}
						/>
					</div>
					<hr class="my-3" />
					<div>
						<button
							class="w-full btn variant-filled-error"
							id="clear"
							on:click|preventDefault={clearSvg}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'clearPopup',
								placement: 'left',
							}}>Löschen</button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="clearPopup">
							<p>Löscht deine Zeichnung, kann rückgängig gemacht werden.</p>
							<div class="arrow variant-filled-secondary" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex items-center w-1/4">
			<button
				class="btn btn-xl w-full variant-soft-secondary p-3"
				type="submit"
				use:popup={{
					event: 'hover',
					target: 'submitPopup',
					placement: 'right',
				}}
				use:confirmed={{
					modalStore,
					title: 'Erstellen?',
					body: 'Möchtest du die Kudo Karte erstellen?',
				}}><Icon icon="mdi:content-save" /></button
			>
			<div class="card p-4 variant-filled-secondary" data-popup="submitPopup">
				<p>Erstellen</p>
				<div class="arrow variant-filled-secondary" />
			</div>
		</div>
	</div>
</div>

<style>
	.controls-wrapper {
		filter: brightness(85%) grayscale();
	}

	.controls-wrapper.active {
		filter: brightness(100%);
	}

	.kudo-content {
		-webkit-text-stroke: 0.3px white;
		text-stroke: 0.3px white;
	}
</style>
