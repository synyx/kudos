<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { SimpleModalState } from './SimpleModalState.svelte';

	let {
		modalState = $bindable(new SimpleModalState()),
		title,
		body,
		onConfirm,
		onCancel
	}: {
		modalState: SimpleModalState;
		title: string;
		body: string;
		onConfirm?: () => void;
		onCancel?: () => void;
	} = $props();
</script>

<Modal open={modalState.open}>
	{#snippet content()}
		<div class="card flex flex-col gap-4 p-4 preset-filled-surface-100-900 shadow-lg">
			<h2 class="text-2xl font-bold">{title}</h2>
			<p>{body}</p>
			<hr />
			<div class="flex justify-end gap-2">
				<button
					onclick={() => {
						modalState.open = false;
						onCancel?.();
					}}
					class="btn btn-md preset-filled-surface-50-950">Close</button
				>
				<button
					onclick={() => {
						modalState.open = false;
						onConfirm?.();
					}}
					class="btn btn-md preset-filled-primary-400-600">Confirm</button
				>
			</div>
		</div>
	{/snippet}
</Modal>
