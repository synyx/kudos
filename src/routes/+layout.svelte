<script lang="ts">
	initializeStores();

	import '../app.postcss';
	import {
		AppRail,
		AppRailAnchor,
		AppRailTile,
		AppShell,
		Drawer,
		LightSwitch,
		Modal,
		Toast,
		modeCurrent,
		setModeCurrent,
		storePopup,
		initializeStores,
		AppBar,
		TabGroup,
		TabAnchor,
	} from '@skeletonlabs/skeleton';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { viewMode } from '$lib/utils/stores';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	function navigateHome() {
		goto('/');
	}
</script>

<Toast />
<Modal />
<Drawer />

<AppShell>
	<div slot="sidebarLeft" class="hidden md:block h-full">
		<AppRail gap="gap-6">
			<svelte:fragment slot="lead">
				<AppRailAnchor href="/">Kudos</AppRailAnchor>
			</svelte:fragment>
			
			<AppRailAnchor href="/new" title="Kudo erstellen">
				<Icon slot="lead" class="text-3xl" icon="mdi:plus-circle" />
				Kudo erstellen
			</AppRailAnchor>

			<hr class="my-4" />

			<AppRailTile bind:group={$viewMode} name="tile-single" value="single" title="Einzelmodus" on:click={navigateHome}>
				<Icon slot="lead" class="text-3xl w-full" icon="mdi:view-array" />
			</AppRailTile>

			<AppRailTile bind:group={$viewMode} name="tile-gallery" value="gallery" title="Galerie" on:click={navigateHome}>
				<Icon slot="lead" class="text-3xl w-full" icon="mdi:view-module" />
			</AppRailTile>

			<AppRailTile
				bind:group={$viewMode}
				name="tile-presentation"
				value="presentation"
				title="Präsentationsmodus"
				on:click={navigateHome}
			>
				<Icon slot="lead" class="text-3xl w-full" icon="mdi:presentation-play" />
			</AppRailTile>

			<svelte:fragment slot="trail">
				<AppRailTile
					name="light-switch"
					active="false"
					on:click={() => {
						setModeCurrent(!$modeCurrent);
					}}
					group="_"
					value="0"
					title="tile-3"
				>
					<div class="flex justify-center pointer-events-none">
						<LightSwitch />
					</div>
				</AppRailTile>

				<AppRailAnchor href="https://github.com/synyx/kudos" target="_blank" title="Source Code">
					<Icon slot="lead" class="text-4xl" icon="mdi:github" />
				</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</div>

	<AppBar slot="pageHeader" slotTrail="place-content-end" class="block md:hidden">
		<div slot="lead">
			{#if $page.url.pathname !== '/'}
				<a href="/" class="btn font-bold variant-soft-surface"><Icon icon="mdi:chevron-left"></Icon></a>
			{/if}
		</div>
		<a href="/">Kudos</a>
		<a slot="trail" href="/new" class="btn variant-filled-primary">Kudo erstellen</a>
	</AppBar>

	<slot />

	<div slot="footer" class="block md:hidden">
		{#if $page.url.pathname === '/'}
			<TabGroup
				justify="justify-center"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				flex="flex-1 lg:flex-none"
				rounded=""
				border=""
				class="bg-surface-100-800-token w-full"
			>
				<TabAnchor href="/" selected={$viewMode === 'single'} on:click={() => ($viewMode = 'single')}>
					<svelte:fragment slot="lead"
						><Icon slot="lead" class="text-3xl w-full" icon="mdi:view-array" /></svelte:fragment
					>
					<span>Einzelmodus</span>
				</TabAnchor>

				<TabAnchor href="/" selected={$viewMode === 'gallery'} on:click={() => ($viewMode = 'gallery')}>
					<svelte:fragment slot="lead"
						><Icon slot="lead" class="text-3xl w-full" icon="mdi:view-module" /></svelte:fragment
					>
					<span>Galerie</span>
				</TabAnchor>

				<TabAnchor href="/" selected={$viewMode === 'presentation'} on:click={() => ($viewMode = 'presentation')}>
					<svelte:fragment slot="lead"
						><Icon slot="lead" class="text-3xl w-full" icon="mdi:presentation-play" /></svelte:fragment
					>
					<span>Präsentation</span>
				</TabAnchor>
			</TabGroup>
		{/if}
	</div>
</AppShell>
