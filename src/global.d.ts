declare module 'svelte/elements' {
  export interface HTMLAttributes<T> {
    onenterViewport?: (event: Event) => void;
    onexitViewport?: (event: Event) => void;
  }
}

export {}; // ensure this is not an ambient module
