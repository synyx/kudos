<script lang="ts">
  import DateRangeInput from '$lib/components/DateRangeInput.svelte';
  import KudosScrollView from '$lib/views/KudosScrollView.svelte';
  import KudosGalleryView from '$lib/views/KudosGalleryView.svelte';
  import KudosPresentationView from '$lib/views/KudosPresentationView.svelte';
  import { createViewModeStore } from '$lib/utils/stores';
  import type { PageData } from './$types';
  import { Switch } from '@skeletonlabs/skeleton-svelte';
  import Icon from '@iconify/svelte';

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
  let searchQuery = $state('');

  let kudosFiltered = $derived(
    kudosAll.filter((kudo) => {
      const matchesDateRange = kudo.createdAt >= dateFrom && kudo.createdAt <= dateTimeTo();
      const matchesArchived = !kudo.archived || showArchived;

      if (!searchQuery.trim()) {
        return matchesDateRange && matchesArchived;
      }

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        kudo.from.toLowerCase().includes(query) ||
        kudo.to.toLowerCase().includes(query) ||
        kudo.content.toLowerCase().includes(query);

      return matchesDateRange && matchesArchived && matchesSearch;
    }),
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
    <div class="relative w-full md:w-64">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon icon="material-symbols:search" class="text-surface-500 text-xl" />
      </div>
      <input
        type="text"
        placeholder="Suche..."
        bind:value={searchQuery}
        class="input pl-10 pr-4 py-2 w-full"
      />
    </div>
    <Switch checked={showArchived} onCheckedChange={(d) => (showArchived = d.checked)}>Archivierte anzeigen</Switch>
    <div class="grow"></div>
    <a href="/new" type="button" class="btn btn-md preset-filled-primary-500">Kudo erstellen</a>
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
