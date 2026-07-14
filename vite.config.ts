import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 由部署目标决定：
// - GitHub Pages 子路径部署保持 /guji-reading-system/
// - zaodeploy 等挂在子域根的托管传 VITE_BASE=/ 覆盖
// 默认值兼容原有 GitHub Pages 流程
const base = process.env.VITE_BASE || '/guji-reading-system/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
