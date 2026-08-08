<script lang="ts">
    import Icon from '@iconify/svelte';
    import type { ToasterStore, ToastType } from './toaster.svelte.ts';

    let { toaster }: { toaster: ToasterStore } = $props();

    const icons: Record<ToastType, string> = {
        info: 'mdi:information-outline',
        success: 'mdi:check-circle-outline',
        warning: 'mdi:alert-outline',
        error: 'mdi:alert-circle-outline',
    };

    const presetClasses: Record<ToastType, string> = {
        info: 'preset-filled-surface-100-900',
        success: 'preset-filled-success-100-900',
        warning: 'preset-filled-warning-100-900',
        error: 'preset-filled-error-100-900',
    };
</script>

<div class="pointer-events-none fixed top-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
    {#each toaster.toasts as toast (toast.id)}
        <div
                class={`card pointer-events-auto flex items-start gap-2 p-3 shadow-lg ${presetClasses[toast.type]}`}
                role="status"
        >
            <Icon icon={icons[toast.type]} class="mt-0.5 shrink-0 text-xl" />
            <div class="min-w-0 flex-1">
                <p class="font-semibold">{toast.title}</p>
                {#if toast.description}
                    <p class="text-sm opacity-80">{toast.description}</p>
                {/if}
            </div>
            <button
                    type="button"
                    onclick={() => toaster.dismiss(toast.id)}
                    class="shrink-0 opacity-60 hover:opacity-100"
                    aria-label="Schließen"
            >
                <Icon icon="mdi:close" />
            </button>
        </div>
    {/each}
</div>