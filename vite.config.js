import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [],
          },
        },
      },
      // Enable chunk size warnings
      chunkSizeWarningLimit: 500,
    },

    plugins: [
      react(),
      // Replace env variables in HTML at build time
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /%VITE_GOOGLE_MAPS_API_KEY%/g,
            env.VITE_GOOGLE_MAPS_API_KEY || '',
          );
        },
      },
    ],

    optimizeDeps: {
      include: ['react-remita'],
    },

    server: {
      force: true,
      // Add security headers for development
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  };
});
