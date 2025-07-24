import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        minify: "esbuild",
        lib: {
            formats: ['es'],
            entry: 'lib/beacon.js'
        },
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: (v) => v.name + '.js'
            }
        },
        outDir: 'src/view/frontend/web/js'
    },
});
