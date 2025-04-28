<script lang="ts">
	import { kudoTitles, type KudoTitles } from '../utils/kudoTitles';
	import BaseKudoCard from './BaseKudoCard.svelte';
	import Svg from './Svg.svelte';
	import viewport from '../actions/useViewportAction';
	import type { Kudo } from '@prisma/client';
	import Icon from "@iconify/svelte";
	import html2canvas from "html2canvas";


	interface Props {
		kudo: Kudo;
		animate?: boolean;
		hideDownloadButton?: boolean;
	}

	let { kudo, animate = false, hideDownloadButton = false }: Props = $props();
	let _animate = $state(true);
	let kudoTitle = $derived(kudoTitles[kudo.kudoTitle as KudoTitles]);
	let contentValue = $derived(kudo.content);
	let toValue = $derived(kudo.to);
	let fromValue = $derived(kudo.from);
	let img = $derived(JSON.parse(kudo.img));
	let kudoId = $derived(`${kudo.id}`);

	async function downloadKudoCard() {
		const elementId = "kudo-card-" + kudoId;
		const target = document.getElementById(elementId);
		let originalOpacity = "";
		let originalTransition = "";
		if (target) {
			const downloadIcon = target.querySelector(".download-icon") as HTMLElement;
			if (downloadIcon) {
				downloadIcon.style.opacity = "0";
				downloadIcon.style.transition = "unset";
				try {
					const canvas = await html2canvas(target, {
						logging: false
					});
					const link = document.createElement("a");
					link.download = `kudos-from-${kudo.from}.png`;
					link.href = canvas.toDataURL("image/png");
					link.click();
				} finally {
					downloadIcon.style.opacity = originalOpacity;
					downloadIcon.style.transition = originalTransition;
				}
			}
		}
	}
</script>

<BaseKudoCard {kudoTitle} {kudoId}>
	<!-- TODO: fix this type error -->
	{#snippet title()}
		<p use:viewport onenterViewport={() => (_animate = true)} onexitViewport={() => (_animate = false)} >
			{kudoTitle.text}
			{#if !hideDownloadButton}
				<button on:click={downloadKudoCard} class="download-btn">
					<Icon class="download-icon" icon="mdi:download"/>
				</button>
			{/if}
		</p>
	{/snippet}
	{#snippet content()}
		<div class="relative overflow-hidden h-full" >
			{#if img.length > 0}
				{#if animate}
					<Svg animate={_animate} renderFormField={false} svgActive={false} strokes={img} />
				{:else}
					<Svg animate={false} renderFormField={false} svgActive={false} strokes={img} />
				{/if}
			{/if}
			<p class="absolute top-0 left-0 whitespace-pre-wrap kudo-content">{contentValue}</p>
		</div>
	{/snippet}
	{#snippet to()}
		<p >Für: <b>{toValue}</b></p>
	{/snippet}
	{#snippet from()}
		<p >Von: <b>{fromValue}</b></p>
	{/snippet}
</BaseKudoCard>

<style>
	.kudo-content {
		-webkit-text-stroke: 0.3px white;
		text-stroke: 0.3px white;
	}
	.kudo-title {
		display: flex;
		justify-content: space-between;
	}
	:global(.download-icon) {
		opacity: 10%;
		transition: opacity 0.3s ease;
	}
	:global(.kudo-card:hover .download-icon) {
		opacity: 1;
	}
</style>
