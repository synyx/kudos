<script lang="ts">
  import '../app.css';
  import { Navigation } from '@skeletonlabs/skeleton-svelte';
  import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';

  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { createViewModeStore } from '$lib/utils/stores';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Logo from '$lib/components/Logo.svelte';
  import { AppBar } from '@skeletonlabs/skeleton-svelte';
  import LightSwitch from '$lib/components/LightSwitch.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const viewMode = createViewModeStore();

  function navigateHome() {
    goto('/');
  }

  let activeNavItem = $derived.by(() => {
    if (page.route.id === '/new') {
      return 'create';
    }

    return $viewMode;
  });
</script>

<div class="grid min-h-screen grid-rows-[1fr_auto]">
  <!-- Grid Columns -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
    <!-- Left Sidebar. -->
    <aside class="hidden max-h-screen md:block sticky top-0">
      <div class="hidden h-full justify-between md:flex md:flex-col">
        <Navigation.Rail background="bg-tertiary-600 dark:bg-surface-900" value={activeNavItem}>
          {#snippet tiles()}
            <Navigation.Tile href="/">
              <div class="w-16">
                <Logo />
              </div>
            </Navigation.Tile>

            <span class="grow"></span>

            <Navigation.Tile id="create" label="Kudo erstellen" labelClasses="text-center" href="/new"
              ><Icon class="text-3xl" icon="mdi:plus-circle" /></Navigation.Tile
            >
            <hr class="my-4 w-full" />

            <Navigation.Tile id="single" label="Einzelmodus" href="/" onclick={() => ($viewMode = 'single')}
              ><Icon class="w-full text-3xl" icon="mdi:view-array" /></Navigation.Tile
            >

            <Navigation.Tile id="gallery" label="Galerie" href="/" onclick={() => ($viewMode = 'gallery')}
              ><Icon class="w-full text-3xl" icon="mdi:view-module" /></Navigation.Tile
            >

            <Navigation.Tile
              id="presentation"
              label="Präsentation"
              href="/"
              onclick={() => ($viewMode = 'presentation')}
              ><Icon class="w-full text-3xl" icon="mdi:presentation-play" /></Navigation.Tile
            >

            <span class="grow"></span>

          {/snippet}
        </Navigation.Rail>

        <div class="flex flex-col items-center justify-center gap-4 p-4 bg-tertiary-600 dark:bg-surface-900">
          <LightSwitch />
          <a
            type="button"
            class="btn btn-lg preset-filled"
            href="https://github.com/synyx/kudos"
            target="_blank"
            onclick={() => ($viewMode = 'presentation')}
          >
            <Icon icon="mdi:github" />
          </a>
        </div>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="max-w-screen overflow-x-hidden">
      {@render children?.()}
    </main>
  </div>
  <!-- Footer -->
  <footer class="h-fit sticky bottom-0">
    <div class="block md:hidden">
      <Navigation.Bar value={activeNavItem} background="bg-tertiary-600 dark:bg-surface-900">
        <Navigation.Tile id="single" label="Einzelmodus" href="/" onclick={() => ($viewMode = 'single')}
          ><Icon class="w-full text-3xl" icon="mdi:view-array" /></Navigation.Tile
        >

        <Navigation.Tile id="gallery" label="Galerie" href="/" onclick={() => ($viewMode = 'gallery')}
          ><Icon class="w-full text-3xl" icon="mdi:view-module" /></Navigation.Tile
        >

        <Navigation.Tile id="presentation" label="Präsentation" href="/" onclick={() => ($viewMode = 'presentation')}
          ><Icon class="w-full text-3xl" icon="mdi:presentation-play" /></Navigation.Tile
        >
      </Navigation.Bar>
    </div>
  </footer>
</div>
