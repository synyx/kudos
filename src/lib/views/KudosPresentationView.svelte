<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { confirmed } from '$lib/actions/useButtonConfirmed';
	import type { Kudo } from '@prisma/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import KudoCard from '../components/KudoCard.svelte';
	import ScrollingView from './ScrollingView.svelte';
	import './scrollview.scss';

	const modalStore = getModalStore();

	export let kudos: Kudo[];
	$: shuffeledKudos = shuffle([...kudos]);

	let started = false;
	let kudoCardIndex = 0;

	function shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}

	async function archiveAllShown() {
		const kudoIds = kudos.map((k) => k.id);

		const response = await fetch('/api/archive', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(kudoIds),
		});

		if (!response.ok) {
			alert('Fehlgeschlagen :(');
			console.error(response, await response.text());
		} else {
			if (browser) {
				invalidateAll();
			}
		}
	}
</script>

{#if !started}
	<div class="w-full h-full flex flex-col justify-center">
		<div class="text-center">
			<button class="btn btn-xl variant-filled-primary shadow-md shadow-secondary-500" on:click={() => (started = true)}
				>SHUFFLE & START!</button
			>
		</div>
	</div>
{:else}
	<ScrollingView
		scrollElementSelector=".kudo-card-wrapper"
		on:scroll={({ detail: index }) => (kudoCardIndex = index)}
		disableLeftScrollButton={kudoCardIndex === 0}
		disableRightScrollButton={kudoCardIndex === kudos.length}
	>
		{#each shuffeledKudos as kudo (kudo.id)}
			<div class="kudo-card-wrapper">
				<div class="w-min justify-center scale-100 sm:scale-125 lg:scale-150">
					<KudoCard animate={true} {kudo} hideDownloadButton/>
				</div>
			</div>
		{/each}
		<div class="kudo-card-wrapper">
			<div class="w-min justify-center scale-150">
				<h1 class="text-center text-3xl dark:text-white mb-3">Das war's</h1>
				<button
					class="btn btn-xl variant-filled-secondary shadow-md shadow-primary-500"
					use:confirmed={{
						modalStore,
						title: 'Archivieren?',
						body: 'Möchtest du die gezeigten Kudos archivieren?',
						onConfirm: archiveAllShown,
					}}>KUDOS ARCHIVIEREN</button
				>
			</div>
		</div>
	</ScrollingView>
{/if}
