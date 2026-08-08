<script lang="ts">
  import '../app.css';
  import { createViewModeStore } from '$lib/utils/stores';
  import Icon from '@iconify/svelte';
  import { page } from '$app/state';
  import Logo from '$lib/components/Logo.svelte';
  import LightSwitch from '$lib/components/LightSwitch.svelte';
  import { resolve } from '$app/paths';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const viewMode = createViewModeStore();

  let activeNavItem = $derived.by(() => {
    if (page.route.id === '/new') {
      return 'create';
    }

    return $viewMode;
  });

  type NavItem = {
    id: 'create' | 'single' | 'gallery' | 'presentation';
    label: string;
    href: string;
    icon: string;
    onclick?: () => void;
  };

  const navItems: NavItem[] = [
    { id: 'create', label: 'Kudo erstellen', href: '/new', icon: 'mdi:plus-circle' },
    {
      id: 'single',
      label: 'Einzelmodus',
      href: '/',
      icon: 'mdi:view-array',
      onclick: () => ($viewMode = 'single'),
    },
    {
      id: 'gallery',
      label: 'Galerie',
      href: '/',
      icon: 'mdi:view-module',
      onclick: () => ($viewMode = 'gallery'),
    },
    {
      id: 'presentation',
      label: 'Präsentation',
      href: '/',
      icon: 'mdi:presentation-play',
      onclick: () => ($viewMode = 'presentation'),
    },
  ];
</script>

{#snippet navTile(item: NavItem, orientation: 'vertical' | 'horizontal')}
  {@const isActive = activeNavItem === item.id}
  <a
    href={resolve(item.href as Parameters<typeof resolve>[0])}
    onclick={item.onclick}
    aria-current={isActive ? 'page' : undefined}
    class={[
      'flex items-center rounded-lg transition-colors',
      orientation === 'vertical'
        ? 'w-full flex-col gap-1 px-2 py-3 text-center'
        : 'flex-1 flex-col gap-1 py-2 text-center',
      isActive
        ? 'bg-primary-400 text-white'
        : 'text-surface-900 dark:text-surface-50 hover:bg-tertiary-500/50 dark:hover:bg-surface-800',
    ].join(' ')}
  >
    <Icon class="w-full text-3xl" icon={item.icon} />
    <span class="text-xs">{item.label}</span>
  </a>
{/snippet}

<div class="grid min-h-screen grid-rows-[1fr_auto]">
  <!-- Grid Columns -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
    <!-- Left Sidebar. -->
    <aside class="hidden max-h-screen md:block sticky top-0">
      <div class="hidden h-full justify-between md:flex md:flex-col bg-tertiary-600 dark:bg-surface-900">
        <nav class="flex flex-col items-center gap-2 p-2">
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a href="/" class="w-16 py-2">
            <Logo />
          </a>

          <span class="grow"></span>

          {@render navTile(navItems[0], 'vertical')}

          <hr class="my-4 w-full" />

          {@render navTile(navItems[1], 'vertical')}
          {@render navTile(navItems[2], 'vertical')}
          {@render navTile(navItems[3], 'vertical')}

          <span class="grow"></span>
        </nav>

        <div class="flex flex-col items-center justify-center gap-4 p-4">
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
      <nav class="flex bg-tertiary-600 dark:bg-surface-900">
        {@render navTile(navItems[1], 'horizontal')}
        {@render navTile(navItems[2], 'horizontal')}
        {@render navTile(navItems[3], 'horizontal')}
      </nav>
    </div>
  </footer>
</div>
