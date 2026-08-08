<script lang="ts">
  import { SimpleModalState } from './SimpleModalState.svelte';

  let {
    modalState = $bindable(new SimpleModalState()),
    title,
    body,
    onConfirm,
    onCancel,
  }: {
    modalState: SimpleModalState;
    title: string;
    body: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } = $props();

  let dialogElement = $state<HTMLDialogElement>();

  $effect(() => {
    if (!dialogElement) return;

    if (modalState.open && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!modalState.open && dialogElement.open) {
      dialogElement.close();
    }
  });

  // Wird ausgelöst bei ESC oder programmatischem close() -> hält modalState in sync
  function handleClose() {
    modalState.open = false;
  }

  function handleCancel() {
    modalState.open = false;
    onCancel?.();
  }

  function handleConfirm() {
    modalState.open = false;
    onConfirm?.();
  }

  // Klick auf das Backdrop (::backdrop liegt außerhalb des dialog-Boxmodells,
  // daher reicht ein Klick-Check auf das <dialog>-Element selbst als Target)
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogElement) {
      handleCancel();
    }
  }
</script>

<dialog
        bind:this={dialogElement}
        onclose={handleClose}
        onclick={handleBackdropClick}
        class="preset-filled-surface-100-900 m-auto rounded-lg p-0 backdrop:bg-black/50"
>
  <div class="card flex flex-col gap-4 p-4 shadow-lg">
    <h2 class="text-2xl font-bold">{title}</h2>
    <p>{body}</p>
    <hr />
    <div class="flex justify-end gap-2">
      <button onclick={handleCancel} class="btn btn-md preset-filled-surface-50-950">Abbrechen</button>
      <button onclick={handleConfirm} class="btn btn-md preset-filled-primary-400-600">Erstellen</button>
    </div>
  </div>
</dialog>