import SimpleModal from '$lib/components/SimpleModal.svelte';
import { SimpleModalState } from '$lib/components/SimpleModalState.svelte';
import { mount } from 'svelte';

type ButtonConfirmedOptions = {
	title: string;
	body?: string;
	onConfirm?: () => unknown;
	onCancel?: () => unknown;
};

export function confirmed(button: HTMLButtonElement, options: ButtonConfirmedOptions) {
	let confirmed = false;
	const modalState = new SimpleModalState();

	const { title, body, onConfirm, onCancel } = options ?? {};

	const modal = mount(SimpleModal, {
		// TODO: unmount
		target: document.body,
		props: {
			modalState,
			title,
			body: body ?? '',
			onCancel,
			onConfirm() {
				try {
					confirmed = true;
					if (onConfirm) {
						onConfirm();
					} else {
						button.click();
					}
				} finally {
					confirmed = false;
				}
			}
		}
	});

	const clickListener = (e: MouseEvent) => {
		if (!confirmed) {
			e.preventDefault();
			modalState.open = true;
		}
	};
	button.addEventListener('click', clickListener);

	return {
		destroy() {
			button.removeEventListener('click', clickListener);
		}
	};
}
