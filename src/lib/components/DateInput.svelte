<script lang="ts">
	export let date = new Date();
	export let id = '';

	let dateString: string;

	$: input(date);
	$: output(dateString);

	function input(date: Date | undefined) {
		if (date && !isNaN(date.getTime())) {
			dateString = date.toISOString().split('T')[0];
		}
	}

	function output(dateString: string) {
		date = new Date(dateString);
	}
</script>

<input class="input" {id} type="date" bind:value={dateString} />
