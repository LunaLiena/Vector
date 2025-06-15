import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { env } from 'process';
import vike from 'vike/plugin';

const backendURl = env.VITE_APP_BACKEND_URL || 'http://127.0.0.1:3000';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  renderer: {
    root: './src/renderer',
    publicDir: './src/renderer/public',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@api': resolve('src/renderer/src/api'),
        '@types': resolve('src/renderer/src/types'),
        '@store': resolve('src/renderer/src/store'),
        '@components': resolve('src/renderer/src/components'),
        '@shared': resolve('src/renderer/src/components/shared'),
        '@api-types': resolve('src/renderer/src/api/apiTypes'),
        '@services': resolve('src/renderer/src/services'),
        '@role-components': resolve('src/renderer/src/components/roles'),
        '@styles':resolve('src/renderer/src/style'),
        '@utils':resolve('src/renderer/src/utils'),
        '@routes':resolve('src/renderer/src/routes'),
        '@hooks':resolve('src/renderer/src/hooks'),
      
      }
    },
    plugins: [
      react(),
      {
        ...vike(),
        enforce: 'post',
        apply: 'serve',
      }
    ],
    define: {
      'process.env': {
        VITE_APP_BACKEND_URL: JSON.stringify(backendURl)
      }
    },
    server: {

      proxy: {
        '/api': {
          target: backendURl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          ws: true,
        }
      }
    }
  },

});


