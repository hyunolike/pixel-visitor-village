import { defineConfig } from 'vite';
export default defineConfig({base:'./',build:{target:'es2022',outDir:'dist/widget',emptyOutDir:true,lib:{entry:'src/visitor-village.ts',formats:['es'],fileName:()=> 'visitor-village.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
