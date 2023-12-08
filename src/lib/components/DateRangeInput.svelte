<script lang="ts">
	import DateInput from './DateInput.svelte';

	export let dateFrom: Date;
	export let dateTo: Date;
</script>

<div class="flex flex-col md:flex-row items-center gap-2">
	<label for="dateFrom">Von:</label>
	<DateInput id="dateFrom" bind:date={dateFrom} />
	<label for="dateTo">Bis:</label>
	<DateInput id="dateTo" bind:date={dateTo} />
</div>
