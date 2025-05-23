<script lang="ts">
	import DateRangeInput from '$lib/components/DateRangeInput.svelte';
	import KudosScrollView from '$lib/views/KudosScrollView.svelte';
	import KudosGalleryView from '$lib/views/KudosGalleryView.svelte';
	import KudosPresentationView from '$lib/views/KudosPresentationView.svelte';
	import { createViewModeStore } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let kudosAll = $derived(data.kudos);

	const lastMonth = new Date();
	lastMonth.setDate(1);
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	const lastMonthsFirstSaturday = getFirstSaturdayFrom(lastMonth);
	let dateFrom: Date = $state(new Date(lastMonthsFirstSaturday));
	
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

	let kudosFiltered = $derived(
		kudosAll.filter(
			(kudo) =>
				kudo.createdAt >= dateFrom &&
				kudo.createdAt <= dateTimeTo() &&
				(!kudo.archived || showArchived)
		)
	);

	const viewMode = createViewModeStore();

	function getFirstSaturdayFrom(originalDate: Date) {
		const date = new Date(originalDate);

		for (let i = 0; i < 8; i++) {
			if (date.getDay() === 6) {
				break;
			}
			date.setDate(date.getDate() + 1);
		}

		return date;
	}
</script>

<div class="flex h-full flex-col">
	<div class="mb-2 flex flex-col items-center gap-4 p-3 md:flex-row">
		<DateRangeInput bind:dateFrom bind:dateTo />
		<Switch checked={showArchived} onCheckedChange={(d) => (showArchived = d.checked)}
			>Archivierte anzeigen</Switch
		>
		<div class="grow"></div>
	</div>
	<div class="h-full w-full overflow-hidden">
		{#if kudosFiltered.length <= 0}
			<div class="flex flex-row h-full w-full justify-center items-center">
				<p class="text-3xl">Keine Kudos gefunden</p>
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
