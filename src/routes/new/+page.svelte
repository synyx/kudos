<script lang="ts">
  import EditableKudoCard from '$lib/components/EditableKudoCard.svelte';
  import Icon from '@iconify/svelte';
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import type { Strokes } from '$lib/utils/types';
  import SimpleModal from '$lib/components/SimpleModal.svelte';
  import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';

  const toaster = createToaster();

  interface Props {
    form: ActionData;
  }

  let { form }: Props = $props();
  let formElement = $state<HTMLFormElement>();

  let contentValue = $state(form?.content ?? '');
  let toValue = $state(form?.to ?? '');
  let fromValue = $state(form?.from ?? '');

  let strokes = $state<Strokes>(JSON.parse(form?.img ?? '[]'));

  $effect(() => {
    if (form) {
      form.content = contentValue;
      form.to = toValue;
      form.from = fromValue;
    }
  });
</script>

<Toaster {toaster}></Toaster>

<div class="flex h-full flex-col justify-center">
  <div class="flex flex-grow flex-col items-center justify-center">
    <h1 class="h1 mb-4">Neue Kudo Karte</h1>
    <form
      bind:this={formElement}
      method="POST"
      use:enhance={() => {
        return async ({ result, update }) => {
          await update({ reset: false });

          if (result.type === 'success') {
            toaster.info({
              title: 'Kudo Karte erstellt 🌟',
            });
            strokes = [];
            contentValue = '';
            toValue = '';
          } else {
            toaster.error({
              title: 'Fehler',
              description: 'Kudo Karte konnte nicht erstellt werden.',
            });
          }
        };
      }}
    >
      {#if form?.error}
        <aside class="alert preset-ghost-error-100-900 mb-2">
          <div class="alert-message">
            <h3 class="h3 flex items-center gap-1">
              <Icon icon="mdi:alert-circle-outline" /> Fehler
            </h3>
            <p>{form?.error}</p>
          </div>
        </aside>
      {/if}
      <EditableKudoCard
        initialKudoTitleId={form?.kudoTitleId ?? 'THANKS'}
        bind:contentValue
        bind:toValue
        bind:fromValue
        bind:strokes
      />
    </form>
  </div>
</div>
