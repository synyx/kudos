<script lang="ts">
	import Icon from '@iconify/svelte';
	import { kudoTitles, type KudoTitle } from '../utils/kudoTitles';
	import { popup } from '@skeletonlabs/skeleton';

	export let currentTitle: KudoTitle = kudoTitles.CONGRATS;

	let dropDownContent: Element;
	let dropDownButton: Element;

	let show = false;
	$: showClass = show ? 'show' : '';

	function windowClickEventlistener(event: MouseEvent) {
		if (event.target && event.target !== dropDownButton) {
			show = false;
		}
	}

	function kudoTitleSelected(kudoTitle: KudoTitle) {
		show = false;
		currentTitle = kudoTitle;
	}
</script>

<svelte:window on:click={windowClickEventlistener} />

<div
	class="dropdown w-full"
	use:popup={{
		event: 'hover',
		target: 'changeTitlePopup',
		placement: 'top',
	}}
>
	<button bind:this={dropDownButton} class="dropbtn inline-flex w-full" on:click|preventDefault={() => (show = !show)}>
		<div class="menu-icon pointer-events-none" class:show={show}>
			<Icon icon="mdi:menu-down" />
		</div>
		{currentTitle.text}
	</button>

	<div class="card p-4 variant-filled-secondary" data-popup="changeTitlePopup">
		<p>Titel ändern</p>
		<div class="arrow variant-filled-secondary" />
	</div>

	<div bind:this={dropDownContent} class="dropdown-content rounded-md {showClass}">
		{#each Object.entries(kudoTitles) as [__, kudoTitle]}
			<button
				style={`background-color: ${kudoTitle.color}`}
				class="text-white block cursor-pointer overflow-hidden p-3"
				on:click|preventDefault={() => kudoTitleSelected(kudoTitle)}
			>
				{kudoTitle.text}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.dropbtn:hover {
		filter: brightness(85%);
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #f1f1f1;
		min-width: 200px;
		overflow: auto;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	.dropdown button:hover {
		filter: brightness(120%);
	}

	.dropdown-content.show {
		@apply flex;
		@apply flex-col;
		@apply gap-0.5;
		@apply py-0.5;
	}

	@keyframes pulse {
		from {
			scale: 1;
		}
		to {
			scale: 1.5;
		}
	}

	.menu-icon {
		animation-name: pulse;
		animation-duration: 200ms;
		animation-iteration-count: 10;
		animation-direction: alternate;
		animation-timing-function: ease-in-out;
		transition: all 0.15s ease-in-out;
	}

	.menu-icon.show {
		transform: scaleY(-1);
	}
</style>
