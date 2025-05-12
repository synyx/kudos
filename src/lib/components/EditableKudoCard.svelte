<script lang="ts">

	import BaseKudoCard from './BaseKudoCard.svelte';
	import KudoTitleSelect from './KudoTitleSelect.svelte';
	import { kudoTitles, type KudoTitle, type KudoTitles } from '../utils/kudoTitles';
	import type { Strokes } from '../utils/types';
	import Svg from './Svg.svelte';
	import Icon from '@iconify/svelte';
	import { SlideToggle, getModalStore, popup } from '@skeletonlabs/skeleton';
	import { confirmed } from '$lib/actions/useButtonConfirmed';
    import { preventDefault } from '$lib/utils/eventModifiers';
    import { createDrawSettingsStore } from '$lib/utils/stores';

	interface Props {
		initialKudoTitleId: KudoTitles;
		contentValue?: string;
		toValue?: string;
		fromValue?: string;
		svgActive: boolean;
		strokes?: Strokes;
	}

	let {
		initialKudoTitleId,
		contentValue = $bindable(''),
		toValue = $bindable(''),
		fromValue = $bindable(''),
		svgActive = $bindable(),
		strokes = $bindable([])
	}: Props = $props();

	const modalStore = getModalStore();

	let svgElement: ReturnType<typeof Svg>;
	let thinning = 0.5;
	let smoothing = 0.5;
	let streamline = 0.5;

	let kudoTitle: KudoTitle = $state(initialKudoTitleId ? kudoTitles[initialKudoTitleId] : kudoTitles.CONGRATS);

	const drawSettings = createDrawSettingsStore();

	let strokeOptions = $derived({
		size: $drawSettings.size, // TODO: BUG drawsettings reset...
		thinning,
		smoothing,
		streamline,
		colorFill: $drawSettings.colorFill,
		colorFillOpacity: $drawSettings.colorFillOpacity,
	});
</script>


<svelte:window
	onkeydown={(e) => {
		if (!svgActive) {
			return;
		}

		if (e.ctrlKey) {
			if (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
				svgElement.redoShit();
			} else if (e.key.toLowerCase() === 'z') {
				svgElement.undoShit();
			}
		}
	}}
/>

<div class="flex flex-col space-y-2">
	<BaseKudoCard bind:kudoTitle>
		{#snippet title()}
				<KudoTitleSelect  bind:currentTitle={kudoTitle} />
			{/snippet}
		{#snippet content()}
				<div class="relative h-full" >
				<input type="hidden" name="kudoTitle" bind:value={kudoTitle.id} />
				<Svg
					bind:this={svgElement}
					{strokeOptions}
					renderFormField={true}
					{svgActive}
					bind:strokes
				/>
				<textarea
					class="kudo-content w-full max-h-full bg-transparent overflow-hidden resize-none absolute top-0 left-0 {!svgActive
						? ''
						: 'pointer-events-none'} border-0"
					name="content"
					bind:value={contentValue}
					placeholder="<Kudos>"
					rows="8"
				></textarea>
			</div>
			{/snippet}
		{#snippet to()}
				<div  class="flex space-x-3 items-center">
				<label for="to">Für:</label>
				<input
					bind:value={toValue}
					class="flex-grow border-solid border-0 border-b-black border-b-2 bg-gray-200"
					type="text"
					name="to"
					id="to"
					placeholder="<Jemand>"
				/>
			</div>
			{/snippet}
		{#snippet from()}
				<div  class="flex space-x-3 items-center">
				<label for="from">Von:</label>
				<input
					bind:value={fromValue}
					class="flex-grow border-0 border-b-black border-b-2 bg-gray-200"
					type="text"
					name="from"
					id="from"
					placeholder="<Dir>"
				/>
			</div>
			{/snippet}
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
						placement: 'top',
					}}
				>
					<label class="cursor-pointer" for="toggleDraw">Malen: </label>
					<SlideToggle id="toggleDraw" name="toggleDraw" class="cursor-pointer" bind:checked={svgActive} />

					<div class="card p-4 variant-filled-secondary" data-popup="toggleDrawPopup">
						<p>{svgActive ? 'Deaktiviere' : 'Aktiviere'} die Leinwand</p>
						<div class="arrow variant-filled-secondary"></div>
					</div>
				</div>
				<hr class="my-3" />
				<div class="controls-wrapper {svgActive ? 'active' : ''}">
					<div class="flex flex-row space-x-2 mt-2">
						<button
							class="btn grow"
							id="undo"
							onclick={preventDefault(() => svgElement.undoShit())}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'undoPopup',
								placement: 'top',
							}}><Icon icon="mdi:undo" /></button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="undoPopup">
							<div class="flex flex-col gap-2">
								<p>Rückgängig / Undo</p>
								<div>
									<kbd class="kbd">STRG + Z</kbd>
								</div>
							</div>
							<div class="arrow variant-filled-secondary"></div>
						</div>

						<button
							class="btn grow"
							id="redo"
							onclick={preventDefault(() => svgElement.redoShit())}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'redoPopup',
								placement: 'top',
							}}><Icon icon="mdi:redo" /></button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="redoPopup">
							<div class="w-32">
								<div class="flex flex-col gap-2">
								<p>
									<span>Wiederholen / Redo</span>
								</p>
									<div>
										<kbd class="kbd">STRG + SHIFT + Z</kbd>
									</div>
									<div>
										<kbd class="kbd">STRG + Y</kbd>
									</div>
								</div>
							</div>
							<div class="arrow variant-filled-secondary"></div>
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
							onclick={preventDefault(() => svgElement.clearShit())}
							disabled={!svgActive}
							use:popup={{
								event: 'hover',
								target: 'clearPopup',
								placement: 'top',
							}}>Löschen</button
						>
						<div class="card p-4 variant-filled-secondary" data-popup="clearPopup">
							<p>
								<span>Löscht deine Zeichnung</span>
								<br>
								<small>kann rückgängig gemacht werden.</small>
							</p>
							<div class="arrow variant-filled-secondary"></div>
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
					placement: 'top',
				}}
				use:confirmed={{
					modalStore,
					title: 'Erstellen?',
					body: 'Möchtest du die Kudo Karte erstellen?',
				}}><Icon icon="mdi:content-save" /></button
			>
			<div class="card p-4 variant-filled-secondary" data-popup="submitPopup">
				<p>Erstellen</p>
				<div class="arrow variant-filled-secondary"></div>
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
