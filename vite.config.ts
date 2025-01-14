import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import { createHtmlPlugin } from "vite-plugin-html"
import basicSsl from "@vitejs/plugin-basic-ssl"

export default defineConfig({
  plugins: [
    viteSingleFile({
      removeViteModuleLoader: true,
      useRecommendedBuildConfig: true,
      inlinePattern: [],
    }),
    createHtmlPlugin({
      minify: true,
    }),
    basicSsl(),
  ],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: Infinity,
  },
  server: {
    https: true,
  },
})
