import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
		tailwindcss(),
	],
	base: '/wdawrs27/',
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: 'jsdom',
		globals: true, // Optional: allows using `describe`, `it`, `expect` without importing them every time
		setupFiles: './src/test/setup.ts', // Optional: for global matchers setup
	},
});
