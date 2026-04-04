// lib/plugins/https.js
import fs from 'fs'
import path from 'path'

export async function setupHttps (targetDir, __dirname) {
  const viteConfigPathTs = path.join(targetDir, 'vite.config.ts')
  const viteConfigPathJs = path.join(targetDir, 'vite.config.js')

  const viteConfigPath = fs.existsSync(viteConfigPathTs) ? viteConfigPathTs : viteConfigPathJs

  if(!viteConfigPath || !fs.existsSync(viteConfigPath)) return

  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

  // 注入 import
  if(!viteConfig.includes("vite-plugin-mkcert")) {
    viteConfig = viteConfig.replace(
      /(import .*?from .*?\n)/,
      `$1import mkcert from 'vite-plugin-mkcert'\n`
    )
  }

  // 注入插件
  if(!viteConfig.includes('mkcert()')) {
    viteConfig = viteConfig.replace(
      /plugins:\s*\[/,
      `plugins: [\n    mkcert(),`
    )
  }

  fs.writeFileSync(viteConfigPath, viteConfig)

  console.log('  ✅ HTTPS 配置完成')
}