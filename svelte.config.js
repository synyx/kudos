import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte'],
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],

  vitePlugin: {
    inspector: true,
  },
  kit: {
    adapter: adapter(),
  },
};
export default config;
