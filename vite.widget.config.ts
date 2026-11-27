import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
const banner =
  '/*!\n' +
  readFileSync(new URL('./public/licenses/pixelfx.txt', import.meta.url), 'utf8') +
  '\n*/';
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [
    {
      name: 'retain-widget-effects-license',
      generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle))
          if (chunk.type === 'chunk') chunk.code = banner + '\n' + chunk.code;
      },
    },
  ],
  build: {
    target: 'es2022',
    outDir: 'dist/widget',
    emptyOutDir: true,
    lib: { entry: 'src/visitor-village.ts', formats: ['es'], fileName: () => 'visitor-village.js' },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
