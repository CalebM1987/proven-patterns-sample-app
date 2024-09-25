import { fileURLToPath, URL } from 'node:url'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { peerDependencies } from "./package.json";
// @ts-ignore
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from 'vite-plugin-dts'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: '/src/assets',
    lib: {
      entry: 'src/index.ts',
      name: '@bmi/core-components',
      fileName: () => `index.js`, // Generates the output file name based on the format.
      formats: ["es"], // Specifies the output formats (CommonJS and ES modules).
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies)
      ],
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
      features: {
        propsDestructure: true
      }
    }),
    quasar(),
    // externalizeDeps(),
    dts(),
    peerDepsExternal(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
