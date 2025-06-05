<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Switch } from '@skeletonlabs/skeleton-svelte';

  let checked = $state(false);

  $effect(() => {
    const mode = localStorage.getItem('mode') || 'light';
    checked = mode === 'light';
  });

  const onCheckedChange = (event: { checked: boolean }) => {
    const mode = event.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
    checked = event.checked;
  };
</script>

<svelte:head>
  <script>
    const mode = localStorage.getItem('mode') || 'light';
    document.documentElement.setAttribute('data-mode', mode);
  </script>
</svelte:head>

<Switch {checked} {onCheckedChange}>
  {#snippet activeChild()}<Icon icon="mdi:weather-sunny" />{/snippet}
  {#snippet inactiveChild()}<Icon icon="mdi:moon-and-stars" />{/snippet}
</Switch>
