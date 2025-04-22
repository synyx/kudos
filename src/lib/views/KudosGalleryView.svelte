<script lang="ts">
	import type { Kudo } from '@prisma/client';
	import KudoCard from '../components/KudoCard.svelte';

	interface Props {
		kudos: Kudo[];
	}

	let { kudos }: Props = $props();
</script>

<div class="flex flex-wrap justify-center gap-2 mb-10">
	{#each kudos as kudo (kudo.id)}
		<KudoCard animate={false} {kudo} />
	{/each}
</div>

<style lang="scss">
</style>
