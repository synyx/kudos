<script lang="ts">
	import type { PageData } from './$types';
	import DateRangeInput from '$lib/components/DateRangeInput.svelte';
	import KudosScrollView from '$lib/views/KudosScrollView.svelte';
	import KudosGalleryView from '$lib/views/KudosGalleryView.svelte';
	import KudosPresentationView from '$lib/views/KudosPresentationView.svelte';
	import { viewMode } from '$lib/utils/stores';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { kudos: kudosAll } = $derived(data);

	let dateFrom: Date = $state(new Date());
	dateFrom.setDate(1);
	dateFrom.setMonth(dateFrom.getMonth() - 1);
	dateFrom = getFirstFridayFrom(dateFrom);
	dateFrom.setDate(dateFrom.getDate() + 1);

	let dateTo: Date = $state(new Date());
	let dateTimeTo = $derived(() => {
		const dateTimeTo = new Date(dateTo);
		dateTimeTo.setHours(23);
		dateTimeTo.setMinutes(59);
		dateTimeTo.setSeconds(59);
		dateTimeTo.setMilliseconds(999);

		return dateTimeTo;
	});

	let showArchived = $state(false);

	let kudosFiltered = $derived(kudosAll.filter(
		(kudo) => kudo.createdAt >= dateFrom && kudo.createdAt <= dateTimeTo() && (!kudo.archived || showArchived),
	));

	function getFirstFridayFrom(originalDate: Date) {
		const date = new Date(originalDate);

		for (let i = 0; i < 8; i++) {
			if (date.getDay() === 5) {
				break;
			}
			date.setDate(date.getDate() + 1);
		}

		return date;
	}
</script>

<div class="h-full flex flex-col">
	<div class="flex flex-col md:flex-row gap-4 p-3 items-center mb-2">
		<DateRangeInput bind:dateFrom bind:dateTo />
		<SlideToggle name="show-archived" size="sm" bind:checked={showArchived}>Archivierte anzeigen</SlideToggle>
		<div class="flex-grow"></div>
	</div>
	<div class="flex flex-col flex-grow items-center justify-center gap-y-4">
		{#if kudosFiltered.length <= 0}
			<div class="flex flex-row">
				<p>Keine Kudos gefunden</p>
			</div>
		{:else if $viewMode === 'single'}
			<KudosScrollView bind:kudos={kudosFiltered} />
		{:else if $viewMode === 'gallery'}
			<KudosGalleryView bind:kudos={kudosFiltered} />
		{:else if $viewMode === 'presentation'}
			<KudosPresentationView bind:kudos={kudosFiltered} />
		{/if}
	</div>
</div>
