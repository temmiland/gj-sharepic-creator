import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: true
	},
	plugins: [react()],
	resolve: {
		alias: [{ find: '@', replacement: '/src' }],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router'],
					'screenshot': ['modern-screenshot'],
				},
			},
		},
		chunkSizeWarningLimit: 500,
	},
})
