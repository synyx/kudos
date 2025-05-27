<script lang="ts">
  import Icon from '@iconify/svelte';
  import debounce from 'debounce';
  import { createEventDispatcher, onMount } from 'svelte';
  import './scrollview.pcss';
  import { preventDefault } from '$lib/utils/eventModifiers';

  interface Props {
    disableLeftScrollButton?: boolean;
    disableRightScrollButton?: boolean;
    scrollElementSelector: string;
    children?: import('svelte').Snippet;
  }

  let {
    disableLeftScrollButton = false,
    disableRightScrollButton = false,
    scrollElementSelector,
    children,
  }: Props = $props();

  const dispatch = createEventDispatcher<{
    scroll: number;
  }>();

  const scrollTimeout = 400;
  let lastScroll = $state(0);
  let scrollContainer: HTMLElement;

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
    if (e.deltaY > 0) {
      scrollTo(1);
    } else {
      scrollTo(-1);
    }
  }

  let disableLeftScrollButtonEffective = $derived(isScrollButtonDisabled(lastScroll, disableLeftScrollButton));
  let disableRightScrollButtonEffective = $derived(isScrollButtonDisabled(lastScroll, disableRightScrollButton));
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'ArrowLeft' && !disableLeftScrollButtonEffective) {
      e.preventDefault();
      scrollTo(-1);
    } else if (e.key === 'ArrowRight' && !disableRightScrollButtonEffective) {
      e.preventDefault();
      scrollTo(1);
    }
  }}
/>

<div class="w-full flex flex-col h-full overflow-x-scroll" onwheel={preventDefault(onWheel)}>
  <div class="flex flex-row relative h-full items-center">
    <div
      class="kudo-card-container m-0 flex flex-row overflow-x-scroll snap-x snap-mandatory h-full items-center"
      bind:this={scrollContainer}
      onscroll={scrolling}
    >
      {@render children?.()}
    </div>

    <button
      class="kudo-scroll-button hidden md:flex dark:text-white absolute left-0 top-1/2 pl-2"
      onclick={() => scrollTo(-1)}
      disabled={disableLeftScrollButtonEffective}
    >
      <Icon font-size="42" icon="mdi:chevron-left" />
    </button>

    <button
      class="kudo-scroll-button hidden md:flex dark:text-white absolute right-0 top-1/2 pr-2"
      onclick={() => scrollTo(1)}
      disabled={disableRightScrollButtonEffective}
    >
      <Icon font-size="42" icon="mdi:chevron-right" />
    </button>
  </div>
  <div class="flex md:hidden flex-row justify-around m-10">
    <button
      class="kudo-scroll-button dark:text-white"
      onclick={() => scrollTo(-1)}
      disabled={disableLeftScrollButtonEffective}
    >
      <Icon icon="mdi:chevron-left" /></button
    >
    <button
      class="kudo-scroll-button dark:text-white"
      onclick={() => scrollTo(1)}
      disabled={disableRightScrollButtonEffective}
    >
      <Icon icon="mdi:chevron-right" />
    </button>
  </div>
</div>
