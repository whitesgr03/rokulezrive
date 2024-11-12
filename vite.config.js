import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomBytes } from 'node:crypto';

export default defineConfig({
	plugins: [react()],
	html: {
		cspNonce: randomBytes(16).toString('base64'),
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/__test__/**/*.test.jsx'],
		exclude: ['src/__test__/**/example*.test.jsx'],
		setupFiles: './src/__test__/setup.js',
	},
});
