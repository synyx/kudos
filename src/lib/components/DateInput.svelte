<script lang="ts">
  // TODO: refactor without legacy workarounds
  import { run } from 'svelte/legacy';

  interface Props {
    date?: any;
    id?: string;
  }

  let { date = $bindable(new Date()), id = '' }: Props = $props();

  let dateString: string = $state('');

  function input(date: Date | undefined) {
    if (date && !isNaN(date.getTime())) {
      dateString = date.toISOString().split('T')[0];
    }
  }

  function output(dateString: string) {
    date = new Date(dateString);
  }
  run(() => {
    input(date);
  });
  run(() => {
    output(dateString);
  });
</script>

<input class="input" {id} type="date" bind:value={dateString} />
