import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'robots.txt'],
          manifest: {
            name: '数学易',
            short_name: '数学易',
            description: '智能数学助手 - 解决您的数学难题',
            theme_color: '#4f46e5',
            icons: [
              {
                src: 'https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/Icon/math_mentor192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/Icon/math_mentor192x192.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: 'https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/Icon/math_mentor192x192.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
