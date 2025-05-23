<script lang="ts">
	import type { Kudo } from '$lib/utils/types';
	import KudoCard from '../components/KudoCard.svelte';
	import ScrollingView from './ScrollingView.svelte';

	interface Props {
		kudos: Kudo[];
	}

	let { kudos = $bindable() }: Props = $props();
	let kudoCardIndex = $state(0);
</script>

<ScrollingView
	scrollElementSelector=".kudo-card-wrapper"
	disableLeftScrollButton={kudoCardIndex === 0}
	disableRightScrollButton={kudoCardIndex === kudos.length - 1}
	on:scroll={({ detail: index }) => {
		kudoCardIndex = index;
	}}
>
	{#each kudos as kudo (kudo.id)}
		<div class="kudo-card-wrapper">
			<div class="w-full flex justify-center">
				<KudoCard animate={true} {kudo} />
			</div>
		</div>
	{/each}
</ScrollingView>
