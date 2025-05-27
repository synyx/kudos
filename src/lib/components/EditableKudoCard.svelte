<script lang="ts">
  import BaseKudoCard from './BaseKudoCard.svelte';
  import KudoTitleSelect from './KudoTitleSelect.svelte';
  import { kudoTitles, type KudoTitle, type KudoTitles } from '../utils/kudoTitles';
  import type { Strokes } from '../utils/types';
  import Svg from './Svg.svelte';
  import Icon from '@iconify/svelte';
  import { confirmed } from '$lib/actions/useButtonConfirmed.svelte';
  import { preventDefault } from '$lib/utils/eventModifiers';
  import { createDrawSettingsStore } from '$lib/utils/stores';
  import SimpleTooltip from './SimpleTooltip.svelte';
  import { Switch } from '@skeletonlabs/skeleton-svelte';

  interface Props {
    initialKudoTitleId: KudoTitles;
    contentValue?: string;
    toValue?: string;
    fromValue?: string;
    strokes?: Strokes;
  }

  let {
    initialKudoTitleId,
    contentValue = $bindable(''),
    toValue = $bindable(''),
    fromValue = $bindable(''),
    strokes = $bindable([]),
  }: Props = $props();

  let svgElement: ReturnType<typeof Svg>;
  let thinning = 0.5;
  let smoothing = 0.5;
  let streamline = 0.5;

  let svgActive = $state(false);

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

  const tooltipDisabled = $derived(!svgActive);
</script>

<svelte:window
  onkeydown={(e) => {
    if (!svgActive) {
      return;
    }

    if (e.ctrlKey) {
      if (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
        svgElement.redo();
      } else if (e.key.toLowerCase() === 'z') {
        svgElement.undo();
      }
    }
  }}
/>

<div class="flex flex-col space-y-2">
  <BaseKudoCard bind:kudoTitle>
    {#snippet title()}
      <KudoTitleSelect bind:currentTitle={kudoTitle} />
    {/snippet}
    {#snippet content()}
      <div class="relative h-full">
        <input type="hidden" name="kudoTitle" bind:value={kudoTitle.id} />
        <Svg bind:this={svgElement} {strokeOptions} renderFormField={true} {svgActive} bind:strokes />
        <textarea
          class="kudo-content absolute top-0 left-0 max-h-full w-full resize-none overflow-hidden bg-transparent {!svgActive
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
      <div class="flex items-center space-x-3">
        <label for="to">Für:</label>
        <input
          bind:value={toValue}
          class="grow border-0 border-b-2 border-solid border-b-black bg-gray-200"
          type="text"
          name="to"
          id="to"
          placeholder="<Jemand>"
        />
      </div>
    {/snippet}
    {#snippet from()}
      <div class="flex items-center space-x-3">
        <label for="from">Von:</label>
        <input
          bind:value={fromValue}
          class="grow border-0 border-b-2 border-b-black bg-gray-200"
          type="text"
          name="from"
          id="from"
          placeholder="<Dir>"
        />
      </div>
    {/snippet}
  </BaseKudoCard>
  <div
    class="flex flex-row items-end justify-between gap-2 rounded-md p-3 dark:text-white bg-tertiary-200 dark:bg-surface-400"
  >
    <div class="flex h-full flex-row justify-center gap-5">
      <div class="flex flex-col items-center">
        <SimpleTooltip text={`${svgActive ? 'Deaktiviere' : 'Aktiviere'} die Leinwand`}>
          <div class="flex justify-center gap-x-2">
            <label class="cursor-pointer" for="toggleDraw">Malen: </label>
            <Switch checked={svgActive} onCheckedChange={(d) => (svgActive = d.checked)}></Switch>
          </div>
        </SimpleTooltip>

        <hr class="my-3" />
        <div class="controls-wrapper {svgActive ? 'active' : ''}">
          <div class="mt-2 flex flex-row space-x-2 justify-center">
            <SimpleTooltip text="Rückgängig / Undo" shortcuts={['STRG + Z']} disabled={tooltipDisabled}>
              <div>
                <button
                  class="btn preset-filled-primary-500 grow w-full"
                  id="undo"
                  onclick={preventDefault(() => svgElement.undo())}
                  disabled={!svgActive}><Icon icon="mdi:undo" /></button
                >
              </div>
            </SimpleTooltip>
            <SimpleTooltip
              text="Wiederholen / Redo"
              shortcuts={['STRG + SHIFT + Z', 'STRG + Y']}
              disabled={tooltipDisabled}
            >
              <div>
                <button
                  class="btn preset-filled-primary-500 grow w-full"
                  id="redo"
                  onclick={preventDefault(() => svgElement.redo())}
                  disabled={!svgActive}><Icon icon="mdi:redo" /></button
                >
              </div>
            </SimpleTooltip>
          </div>
          <hr class="my-3" />
          <div>
            <label for="color">Farbe: </label>
            <input
              id="color"
              bind:value={$drawSettings.colorFill}
              type="color"
              class="h-5 w-full rounded-lg {svgActive ? 'cursor-pointer' : 'cursor-not-allowed'}"
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
            <SimpleTooltip
              text="Löscht deine Zeichnung"
              subText="kann rückgängig gemacht werden."
              disabled={tooltipDisabled}
            >
              <button
                class="btn bg-primary-300 w-full"
                id="clear"
                onclick={preventDefault(() => svgElement.clear())}
                disabled={!svgActive}>Löschen</button
              >
            </SimpleTooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-1/4 items-center">
      <SimpleTooltip text="Kudo Karte erstellen" disabled={tooltipDisabled}>
        <button
          class="btn btn-xl preset-filled-secondary-500 w-full p-3"
          type="submit"
          use:confirmed={{
            // modalStore,
            title: 'Erstellen?',
            body: 'Möchtest du die Kudo Karte erstellen?',
          }}><Icon icon="mdi:content-save" /></button
        >
      </SimpleTooltip>
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
