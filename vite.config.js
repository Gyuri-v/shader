import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl(), ViteEjsPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
