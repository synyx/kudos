<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Tooltip } from '@skeletonlabs/skeleton-svelte';

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
</script>

<Tooltip classes="w-full" triggerClasses="w-full" {disabled} openDelay={500}>
  {#snippet trigger()}
    {@render children()}
  {/snippet}
  {#snippet content()}
    <div class="card preset-filled-surface-100-900 p-2">
      <p>{text}</p>
      {#if subText}
        <br />
        <p class="text-surface-500 text-sm">{subText}</p>
      {/if}
      {#if shortcuts}
        <br />
        <div class="flex flex-wrap gap-2">
          {#each shortcuts as shortcut}
            <kbd class="kbd">{shortcut}</kbd>
          {/each}
        </div>
      {/if}
    </div>
  {/snippet}
</Tooltip>
