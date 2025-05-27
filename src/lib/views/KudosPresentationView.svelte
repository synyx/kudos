<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { confirmed } from '$lib/actions/useButtonConfirmed.svelte';
  import KudoCard from '../components/KudoCard.svelte';
  import ScrollingView from './ScrollingView.svelte';
  import './scrollview.pcss';
  import type { Kudo } from '$lib/utils/types';

  interface Props {
    kudos: Kudo[];
  }

  let { kudos = $bindable() }: Props = $props();

  let started = $state(false);
  let kudoCardIndex = $state(0);

  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  async function archiveAllShown() {
    const kudoIds = kudos.map((k) => k.id);

    const response = await fetch('/api/archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kudoIds),
    });

    if (!response.ok) {
      alert('Fehlgeschlagen :(');
      console.error(response, await response.text());
    } else {
      if (browser) {
        invalidateAll();
      }
    }
  }
  let shuffeledKudos = $derived(shuffle([...kudos]));
</script>

{#if !started}
  <div class="flex h-full w-full flex-col justify-center">
    <div class="text-center">
      <button
        class="btn btn-lg preset-filled-primary-500 shadow-surface-500 shadow-md"
        onclick={() => (started = true)}>SHUFFLE & START!</button
      >
    </div>
  </div>
{:else}
  <ScrollingView
    scrollElementSelector=".kudo-card-wrapper"
    on:scroll={({ detail: index }) => (kudoCardIndex = index)}
    disableLeftScrollButton={kudoCardIndex === 0}
    disableRightScrollButton={kudoCardIndex === kudos.length}
  >
    {#each shuffeledKudos as kudo (kudo.id)}
      <div class="kudo-card-wrapper">
        <div class="flex w-full scale-100 justify-center sm:scale-125 lg:scale-150">
          <KudoCard animate={true} {kudo} hideDownloadButton/>
        </div>
      </div>
    {/each}
    <div class="kudo-card-wrapper">
      <div class="flex w-full scale-150 justify-center">
        <div class="flex flex-col justify-center">
          <h1 class="mb-3 text-center text-3xl dark:text-white">Das war's</h1>
          <button
            class="btn btn-xl preset-filled-secondary-100-900 shadow-surface-500 shadow-md"
            use:confirmed={{
              title: 'Archivieren?',
              body: 'Möchtest du die gezeigten Kudos archivieren?',
              onConfirm: archiveAllShown,
            }}>KUDOS ARCHIVIEREN</button
          >
        </div>
      </div>
    </div>
  </ScrollingView>
{/if}
