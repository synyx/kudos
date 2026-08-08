export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
};

export type Toast = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

const DEFAULT_DURATION = 4000;

export function createToaster() {
  let toasts = $state<Toast[]>([]);
  let counter = 0;

  function push(type: ToastType, options: ToastOptions) {
    const id = ++counter;
    const duration = options.duration ?? DEFAULT_DURATION;

    toasts.push({ id, type, title: options.title, description: options.description });

    setTimeout(() => dismiss(id), duration);

    return id;
  }

  function dismiss(id: number) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  return {
    get toasts() {
      return toasts;
    },
    info: (options: ToastOptions) => push('info', options),
    success: (options: ToastOptions) => push('success', options),
    warning: (options: ToastOptions) => push('warning', options),
    error: (options: ToastOptions) => push('error', options),
    dismiss,
  };
}

export type ToasterStore = ReturnType<typeof createToaster>;
