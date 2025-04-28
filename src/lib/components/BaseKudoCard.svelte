<script lang="ts">
	import type { KudoTitle } from '../utils/kudoTitles';

	interface Props {
		kudoTitle: KudoTitle;
		kudoId: string;
		title?: import('svelte').Snippet;
		to?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
		from?: import('svelte').Snippet;
	}

	let {
		kudoTitle = $bindable(),
		kudoId,
		title,
		to,
		content,
		from
	}: Props = $props();
</script>

<div class="kudo-card" id={"kudo-card-" + kudoId}>
	<div class="title h-1/5" style="background-color: {kudoTitle.color};">
		{@render title?.()}
	</div>
	<div class="content h-4/5 p-2 flex flex-col">
		<div class="to mb-2 flex-grow-0">
			{@render to?.()}
		</div>
		<div class="w-full flex-grow">
			{@render content?.()}
		</div>
		<div class="from mt-2 flex-grow-0">
			{@render from?.()}
		</div>
	</div>
</div>

<style lang="postcss">
	.kudo-card {
		@apply border-solid;
		@apply border-gray-900;
		@apply border-2;
		@apply rounded-md;
		@apply bg-gray-200;
		@apply dark:text-black;

		aspect-ratio: 556 / 380;

		.title {
			@apply text-white;
			@apply bg-gray-900;
			@apply rounded-t-md;
			@apply p-5;
			@apply text-4xl;
			@apply h-1/5;
		}

		/* Extra small devices (phones, 600px and down) */
		@media only screen and (max-width: 600px) {
			width: 20rem;
			height: 15rem;
			.title {
				@apply text-xl;
				@apply p-3;
			}

			.content {
				font-size: 0.71rem;
				line-height: 0.95rem;
			}
		}

		/* Small devices (portrait tablets and large phones, 600px and up) */
		@media only screen and (min-width: 600px) {
			width: 30rem;
			height: 20rem;
			.title {
				@apply text-2xl;
				@apply p-4;
			}

			.content {
				font-size: 1.1rem;
				line-height: 1.35rem;
			}
		}

		/* Medium devices (landscape tablets, 768px and up) */
		@media only screen and (min-width: 768px) {
			width: 30rem;
			height: 20rem;

			.title {
				@apply text-2xl;
				@apply p-4;
			}

			.content {
				font-size: 1.1rem;
				line-height: 1.35rem;
			}
		}

		/* Large devices (laptops/desktops, 992px and up) */
		@media only screen and (min-width: 992px) {
			width: 35rem;
			height: 24rem;

			.title {
				@apply text-4xl;
				@apply p-5;
			}

			.content {
				font-size: 1.32rem;
				line-height: 1.65rem;
			}
		}

		/* Extra large devices (large laptops and desktops, 1200px and up) */
		@media only screen and (min-width: 1200px) {
			width: 35rem;
			height: 24rem;

			.title {
				@apply text-4xl;
				@apply p-5;
			}
		}
	}
</style>
