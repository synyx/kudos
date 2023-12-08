<script lang="ts">
	import { kudoTitles, type KudoTitles } from '../utils/kudoTitles';
	import BaseKudoCard from './BaseKudoCard.svelte';
	import Svg from './Svg.svelte';
	import viewport from '../actions/useViewportAction';
	import type { Kudo } from '@prisma/client';

	export let kudo: Kudo;
	$: kudoTitle = kudoTitles[kudo.kudoTitle as KudoTitles];
	$: content = kudo.content;
	$: to = kudo.to;
	$: from = kudo.from;
	$: img = JSON.parse(kudo.img);

	export let animate = false;
	let _animate = true;
</script>

<BaseKudoCard {kudoTitle}>
	<!-- TODO: fix this type error -->
	<p use:viewport on:enterViewport={() => (_animate = true)} on:exitViewport={() => (_animate = false)} slot="title">
		{kudoTitle.text}
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
</style>
