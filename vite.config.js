import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'

// Post-build plugin: copies dist/index.html → dist/lab/index.html
// so Cloudflare Pages serves the SPA when /lab/ is requested
function copyIndexToLab() {
  return {
    name: 'copy-index-to-lab',
    closeBundle() {
      try {
        const distIndex = readFileSync(resolve('dist/index.html'), 'utf-8')
        const labDir = resolve('dist/lab')
        // lab/ dir already exists from public/lab/ copy — just overwrite index.html
        writeFileSync(resolve(labDir, 'index.html'), distIndex)
        console.log('✓ Copied dist/index.html → dist/lab/index.html')
      } catch (e) {
        console.warn('⚠ Could not copy index to lab:', e.message)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyIndexToLab()],
})
