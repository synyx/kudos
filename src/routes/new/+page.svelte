<script lang="ts">
	import EditableKudoCard from '$lib/components/EditableKudoCard.svelte';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { Strokes } from '$lib/utils/types';

	const toastStore = getToastStore();

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let formElement = $state<HTMLFormElement>();
	let svgActive = $state(false);

	let strokes = $state<Strokes>(JSON.parse(form?.img ?? '[]'));
</script>

<div class="flex flex-col h-full justify-center">
	<div class="flex flex-col flex-grow items-center justify-center">
		<h1 class="h1 mb-4">Neue Kudo Karte</h1>
		<form
			bind:this={formElement}
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();

					if (result.type === 'success') {
						toastStore.trigger({
							message: 'Kudo Karte erstellt 🌟',
							background: 'variant-glass-success',
						});
						strokes = [];
					} else {
						toastStore.trigger({
							message: 'Erstellen fehlgeschlagen :(',
							background: 'variant-glass-error',
						});
					}
				};
			}}
		>
			{#if form?.error}
				<aside class="alert variant-ghost-error mb-2">
					<div class="alert-message">
						<h3 class="h3 flex gap-1 items-center"><Icon icon="mdi:alert-circle-outline" /> Fehler</h3>
						<p>{form?.error}</p>
					</div>
				</aside>
			{/if}
			<EditableKudoCard
				bind:svgActive
				initialKudoTitleId={form?.kudoTitleId ?? 'THANKS'}
				initialContent={form?.content}
				initialTo={form?.to}
				initialFrom={form?.from}
				bind:strokes
			/>
		</form>
	</div>
</div>
