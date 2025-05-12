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

	let contentValue = $state(form?.content ?? '');
	let toValue = $state(form?.to ?? '');
	let fromValue = $state(form?.from ?? '');

	let strokes = $state<Strokes>(JSON.parse(form?.img ?? '[]'));

	$effect(() => {
		if(form) {
			form.content = contentValue;
			form.to = toValue;
			form.from = fromValue;
		}
	});
</script>

<div class="flex flex-col h-full justify-center">
	<div class="flex flex-col flex-grow items-center justify-center">
		<h1 class="h1 mb-4">Neue Kudo Karte</h1>
		<form
			bind:this={formElement}
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update({ reset: false });

					if (result.type === 'success') {
						toastStore.trigger({
							message: 'Kudo Karte erstellt 🌟',
							background: 'variant-glass-success',
						});
						strokes = [];
						contentValue = '';
						toValue = '';
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
				bind:contentValue
				bind:toValue
				bind:fromValue
				bind:strokes
			/>
		</form>
	</div>
</div>
