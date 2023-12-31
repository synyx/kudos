<script lang="ts">
	import Icon from '@iconify/svelte';
	import debounce from 'debounce';
	import { createEventDispatcher, onMount } from 'svelte';
	import './scrollview.scss';

	export let disableLeftScrollButton = false;
	export let disableRightScrollButton = false;
	export let scrollElementSelector: string;

	const dispatch = createEventDispatcher<{
		scroll: number;
	}>();

	const scrollTimeout = 400;
	let lastScroll = 0;
	let scrollContainer: HTMLElement;

	$: disableLeftScrollButtonEffective = isScrollButtonDisabled(lastScroll, disableLeftScrollButton);
	$: disableRightScrollButtonEffective = isScrollButtonDisabled(lastScroll, disableRightScrollButton);

	const onWheel = debounce(_onWheel, 200);

	function isScrollButtonDisabled(lastScroll: number, hide: boolean) {
		return hide || !isScrollAllowed(lastScroll);
	}

	function scrollTo(direction: 1 | -1) {
		if (isScrollAllowed(lastScroll)) {
			const cardWidth = scrollContainer.querySelector<HTMLElement>(scrollElementSelector)?.offsetWidth || 0;
			scrollContainer.scrollBy({
				left: direction * cardWidth,
				behavior: 'smooth',
			});
		}
	}

	function isScrollAllowed(lastScroll: number) {
		return Date.now() - lastScroll >= scrollTimeout;
	}

	function scrolling() {
		const currentIndex = Math.round(scrollContainer.scrollLeft / scrollContainer.offsetWidth);
		dispatch('scroll', currentIndex);

		lastScroll = Date.now();
	}

	onMount(() => {
		const intervalId = setInterval(() => {
			disableLeftScrollButtonEffective = isScrollButtonDisabled(lastScroll, disableLeftScrollButton);
			disableRightScrollButtonEffective = isScrollButtonDisabled(lastScroll, disableRightScrollButton);
		}, 200);

		return () => {
			clearInterval(intervalId);
		};
	});

	function _onWheel(e: WheelEvent) {
		if(e.deltaY > 0) {
			scrollTo(1);
		} else {
			scrollTo(-1);
		}
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'ArrowLeft' && !disableLeftScrollButtonEffective) {
			e.preventDefault();
			scrollTo(-1);
		} else if (e.key === 'ArrowRight' && !disableRightScrollButtonEffective) {
			e.preventDefault();
			scrollTo(1);
		}
	}}
/>

<div class="w-full flex flex-col h-full" on:wheel|preventDefault={onWheel}>
	<div class="flex flex-row relative h-full items-center">
		<button
			class="kudo-scroll-button hidden md:flex dark:text-white absolute left-0 top-0 h-full pl-2"
			on:click={() => scrollTo(-1)}
			disabled={disableLeftScrollButtonEffective}
		>
			<Icon icon="mdi:chevron-left" />
		</button>
		<div
			class="kudo-card-container m-0 flex flex-row overflow-x-scroll snap-x snap-mandatory h-full items-center"
			bind:this={scrollContainer}
			on:scroll={scrolling}
		>
			<slot />
		</div>
		<button
			class="kudo-scroll-button hidden md:flex dark:text-white absolute h-full right-0 top-0 pr-2"
			on:click={() => scrollTo(1)}
			disabled={disableRightScrollButtonEffective}
		>
			<Icon icon="mdi:chevron-right" />
		</button>
	</div>
	<div class="flex md:hidden flex-row justify-around m-10">
		<button
			class="kudo-scroll-button dark:text-white"
			on:click={() => scrollTo(-1)}
			disabled={disableLeftScrollButtonEffective}
		>
			<Icon icon="mdi:chevron-left" /></button
		>
		<button
			class="kudo-scroll-button dark:text-white"
			on:click={() => scrollTo(1)}
			disabled={disableRightScrollButtonEffective}
		>
			<Icon icon="mdi:chevron-right" />
		</button>
	</div>
</div>
