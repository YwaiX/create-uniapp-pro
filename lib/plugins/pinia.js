// lib/plugins/pinia.js
import fs from 'fs'
import path from 'path'

export async function setupPinia (language, targetDir, __dirname) {
  // 1. 复制 Pinia 模板文件
  const piniaTemplate = language === 'ts' ? 'pinia-ts' : 'pinia-js'
  const srcPath = path.resolve(__dirname, `../template/${piniaTemplate}`)
  if(fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, targetDir, { recursive: true })
  }

  // 2. 配置 main 文件
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!fs.existsSync(mainPath)) return

  let content = fs.readFileSync(mainPath, 'utf-8')

  // 注入 Pinia 导入
  const piniaImport = `import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'`
  content = content.replace('/* __PINIA_IMPORT__ */', piniaImport)

  // 注入 Pinia 使用
  const piniaUse = `app.use(createPinia().use(persistedstate))`
  content = content.replace('/* __PINIA_USE__ */', piniaUse)

  fs.writeFileSync(mainPath, content)

  console.log('  ✅ Pinia 配置完成')
}