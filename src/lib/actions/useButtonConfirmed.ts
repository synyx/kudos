import type { getModalStore } from '@skeletonlabs/skeleton';

type ButtonConfirmedOptions = {
  modalStore: ReturnType<typeof getModalStore>;
  title?: string;
  body?: string;
  onConfirm?: () => unknown;
  onCancel?: () => unknown;
};

export function confirmed(button: HTMLButtonElement, options: ButtonConfirmedOptions) {
  let confirmed = false;

  const clickListener = (e: MouseEvent) => {
    if (!confirmed) {
      e.preventDefault();

      const { title, body, modalStore, onConfirm, onCancel } = options ?? {};

      modalStore.trigger({
        type: 'confirm',
        title,
        body,
        response(r) {
          try {
            if (r) {
              confirmed = true;
              if (onConfirm) {
                onConfirm();
              } else {
                button.click();
              }
            } else {
              if (onCancel) {
                onCancel();
              }
            }
          } finally {
            confirmed = false;
          }
        },
      });
    }
  };
  button.addEventListener('click', clickListener);

  return {
    destroy() {
      button.removeEventListener('click', clickListener);
    },
  };
}
