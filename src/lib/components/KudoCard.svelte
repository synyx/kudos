<script lang="ts">
	import { kudoTitles, type KudoTitles } from '../utils/kudoTitles';
	import BaseKudoCard from './BaseKudoCard.svelte';
	import Svg from './Svg.svelte';
	import viewport from '../actions/useViewportAction';
	import type { Kudo } from '@prisma/client';
	import Icon from "@iconify/svelte";
	import html2canvas from "html2canvas";

	export let kudo: Kudo;
	$: kudoId = `${kudo.id}`
	$: kudoTitle = kudoTitles[kudo.kudoTitle as KudoTitles];
	$: content = kudo.content;
	$: to = kudo.to;
	$: from = kudo.from;
	$: img = JSON.parse(kudo.img);

	export let animate = false;
	export let hideDownloadButton = false;
	let _animate = true;

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
	<p use:viewport on:enterViewport={() => (_animate = true)} on:exitViewport={() => (_animate = false)} slot="title" class="kudo-title">
		{kudoTitle.text}
		{#if !hideDownloadButton}
			<button on:click={downloadKudoCard} class="download-btn">
				<Icon class="download-icon" icon="mdi:download"/>
			</button>
		{/if}
	</p>
	<div class="relative overflow-hidden h-full" slot="content">
		{#if img.length > 0}
			{#if animate}
				<Svg animate={_animate} renderFormField={false} svgActive={false} initialStrokes={img} />
			{:else}
				<Svg animate={false} renderFormField={false} svgActive={false} initialStrokes={img} />
			{/if}
		{/if}
		<p class="absolute top-0 left-0 whitespace-pre-wrap kudo-content">{content}</p>
	</div>
	<p slot="to">Für: <b>{to}</b></p>
	<p slot="from">Von: <b>{from}</b></p>
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
