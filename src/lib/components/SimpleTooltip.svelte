<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy } from 'svelte';

  let {
    children,
    text,
    subText,
    shortcuts,
    disabled = false,
  }: {
    children: Snippet;
    text: string;
    subText?: string;
    shortcuts?: string[];
    disabled?: boolean;
  } = $props();

  const openDelay = 500;

  let open = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function show() {
    if (disabled) return;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => (open = true), openDelay);
  }

  function hide() {
    clearTimeout(timeoutId);
    open = false;
  }

  onDestroy(() => clearTimeout(timeoutId));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span class="relative inline-block w-full" onmouseenter={show} onmouseleave={hide} onfocusin={show} onfocusout={hide}>
  {@render children()}

  {#if open && !disabled}
    <div
      role="tooltip"
      class="card preset-filled-surface-100-900 absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 p-2 shadow-lg"
    >
      <p>{text}</p>
      {#if subText}
        <br />
        <p class="text-surface-400 text-sm">{subText}</p>
      {/if}
      {#if shortcuts}
        <br />
        <div class="flex flex-wrap gap-2">
          {#each shortcuts as shortcut (shortcut)}
            <kbd class="kbd">{shortcut}</kbd>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</span>
