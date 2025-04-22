<script lang="ts">
	import DateInput from './DateInput.svelte';

	interface Props {
		dateFrom: Date;
		dateTo: Date;
	}

	let { dateFrom = $bindable(), dateTo = $bindable() }: Props = $props();
</script>

<div class="flex flex-col md:flex-row items-center gap-2">
	<label for="dateFrom">Von:</label>
	<DateInput id="dateFrom" bind:date={dateFrom} />
	<label for="dateTo">Bis:</label>
	<DateInput id="dateTo" bind:date={dateTo} />
</div>
