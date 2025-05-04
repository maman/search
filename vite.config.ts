import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	build: {
		chunkSizeWarningLimit: 5 * 1024 * 1024,
	},
	plugins: [
		// @ts-ignore
		cloudflare(),
		VitePWA({
			registerType: "autoUpdate",
			showMaximumFileSizeToCacheInBytesWarning: true,
			workbox: {
				navigateFallbackDenylist: [/^\/api/],
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "gstatic-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
});
