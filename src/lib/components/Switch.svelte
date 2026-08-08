<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        checked = false,
        onCheckedChange,
        disabled = false,
        id,
        children,
        activeChild,
        inactiveChild,
    }: {
        checked?: boolean;
        onCheckedChange?: (event: { checked: boolean }) => void;
        disabled?: boolean;
        id?: string;
        children?: Snippet;
        activeChild?: Snippet;
        inactiveChild?: Snippet;
    } = $props();

    function toggle() {
        if (disabled) return;
        onCheckedChange?.({ checked: !checked });
    }
</script>

<label
        class="inline-flex items-center gap-2 select-none"
        class:cursor-pointer={!disabled}
        class:cursor-not-allowed={disabled}
        class:opacity-50={disabled}
>
    <button
            type="button"
            role="switch"
            aria-checked={checked}
            {id}
            {disabled}
            onclick={toggle}
            class={[
      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
      checked ? 'bg-primary-400-600' : 'bg-surface-300 dark:bg-surface-600',
    ].join(' ')}
    >
    <span
            class={[
        'inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0.5',
      ].join(' ')}
    >
      {#if checked && activeChild}
        {@render activeChild()}
      {:else if !checked && inactiveChild}
        {@render inactiveChild()}
      {/if}
    </span>
    </button>
    {#if children}
        <span>{@render children()}</span>
    {/if}
</label>