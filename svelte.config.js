import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        appDir: 'app',
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: "index.html"
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/PatternGenerator' : ''
        }
    }
};

export default config;
