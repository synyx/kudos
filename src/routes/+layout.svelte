<script lang="ts">
  initializeStores();

  import '../app.postcss';
  import {
    AppRail,
    AppRailAnchor,
    AppRailTile,
    AppShell,
    Drawer,
    LightSwitch,
    Modal,
    Toast,
    modeCurrent,
    setModeCurrent,
    storePopup,
    initializeStores,
    AppBar,
    TabGroup,
    TabAnchor,
  } from '@skeletonlabs/skeleton';
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { viewMode } from '$lib/utils/stores';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Logo from '$lib/components/Logo.svelte';
    import type { ViewMode } from '$lib/utils/types';
    import { onMount } from 'svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let viewModeWorkaround: ViewMode = $state($viewMode);

  onMount(() => {
    viewModeWorkaround = $viewMode;
  });

  function navigateHome() {
    goto('/');
  }
</script>

<Toast />
<Modal />
<Drawer />

<AppShell>
  {#snippet sidebarLeft()}
    <div  class="hidden md:block h-full">
      <AppRail gap="gap-6">
        {#snippet lead()}
          
            <AppRailAnchor href="/"><Logo/></AppRailAnchor>
          
          {/snippet}

        <AppRailAnchor href="/new" title="Kudo erstellen">
          {#snippet lead()}
                <Icon  class="text-3xl" icon="mdi:plus-circle" />
              {/snippet}
          Kudo erstellen
        </AppRailAnchor>

        <hr class="my-4" />

        <AppRailTile bind:group={viewModeWorkaround} name="tile-single" value="single" title="Einzelmodus" on:click={navigateHome} on:click={() => $viewMode = 'single'}>
          {#snippet lead()}
                <Icon  class="text-3xl w-full" icon="mdi:view-array" />
              {/snippet}
        </AppRailTile>

        <AppRailTile bind:group={viewModeWorkaround} name="tile-gallery" value="gallery" title="Galerie" on:click={navigateHome} on:click={() => $viewMode = 'gallery'}>
          {#snippet lead()}
                <Icon  class="text-3xl w-full" icon="mdi:view-module" />
              {/snippet}
        </AppRailTile>

        <AppRailTile
          bind:group={viewModeWorkaround}
          name="tile-presentation"
          value="presentation"
          title="Präsentationsmodus"
          on:click={navigateHome}
          on:click={() => $viewMode = 'presentation'}
        >
          {#snippet lead()}
                <Icon  class="text-3xl w-full" icon="mdi:presentation-play" />
              {/snippet}
        </AppRailTile>

        {#snippet trail()}
          
            <AppRailTile
              name="light-switch"
              active="false"
              on:click={() => {
                setModeCurrent(!$modeCurrent);
              }}
              group="_"
              value="0"
              title="tile-3"
            >
              <div class="flex justify-center pointer-events-none">
                <LightSwitch />
              </div>
            </AppRailTile>

            <AppRailAnchor href="https://github.com/synyx/kudos" target="_blank" title="Source Code">
              {#snippet lead()}
                    <Icon  class="text-4xl" icon="mdi:github" />
                  {/snippet}
            </AppRailAnchor>
          
          {/snippet}
      </AppRail>
    </div>
  {/snippet}

  {#snippet pageHeader()}
    <AppBar  slotTrail="place-content-end" class="block md:hidden">
      {#snippet lead()}
        <div >
          {#if page.url.pathname !== '/'}
            <a href="/" class="btn font-bold variant-soft-surface"><Icon icon="mdi:chevron-left"></Icon></a>
          {/if}
        </div>
      {/snippet}
      <a href="/"><Logo/></a>
      {#snippet trail()}
        <a  href="/new" class="btn variant-filled-primary">Kudo erstellen</a>
      {/snippet}
    </AppBar>
  {/snippet}

  {@render children?.()}

  {#snippet footer()}
    <div  class="block md:hidden">
      {#if page.url.pathname === '/'}
        <TabGroup
          justify="justify-center"
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
          flex="flex-1 lg:flex-none"
          rounded=""
          border=""
          class="bg-surface-100-800-token w-full"
        >
          <TabAnchor href="/" selected={$viewMode === 'single'} on:click={() => ($viewMode = 'single')}>
            {#snippet lead()}
                          <Icon  class="text-3xl w-full" icon="mdi:view-array" />
                  {/snippet}
            <span>Einzelmodus</span>
          </TabAnchor>

          <TabAnchor href="/" selected={$viewMode === 'gallery'} on:click={() => ($viewMode = 'gallery')}>
            {#snippet lead()}
                          <Icon  class="text-3xl w-full" icon="mdi:view-module" />
                  {/snippet}
            <span>Galerie</span>
          </TabAnchor>

          <TabAnchor href="/" selected={$viewMode === 'presentation'} on:click={() => ($viewMode = 'presentation')}>
            {#snippet lead()}
                          <Icon  class="text-3xl w-full" icon="mdi:presentation-play" />
                  {/snippet}
            <span>Präsentation</span>
          </TabAnchor>
        </TabGroup>
      {/if}
    </div>
  {/snippet}
</AppShell>
