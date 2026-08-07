declare module 'svelte/elements' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface HTMLAttributes<T> {
    onenterViewport?: (event: Event) => void;
    onexitViewport?: (event: Event) => void;
  }
}

export {}; // ensure this is not an ambient module
