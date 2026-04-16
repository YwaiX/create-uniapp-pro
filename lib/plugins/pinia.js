// lib/plugins/pinia.js
import { configurationMain, copyTemplate } from '../utils'

/**
 * 配置 Pinia（含持久化插件）
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupPinia (language, targetDir, __dirname) {
  // 1. 复制 Pinia 模板文件
  const piniaTemplate = language === 'ts' ? 'pinia-ts' : 'pinia-js'
  await copyTemplate(piniaTemplate, targetDir, __dirname)

  // 2. 配置 main 文件
  // 注入 Pinia 导入
  const piniaImport = `import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'`
  // 注入 Pinia 使用
  const piniaUse = `app.use(createPinia().use(persistedstate))`
  let array = [
    {
      template: '/* __PINIA_IMPORT__ */',
      content: piniaImport
    },
    {
      template: '/* __PINIA_USE__ */',
      content: piniaUse
    }
  ]
  configurationMain(language, targetDir, array)

  console.log('  ✅ Pinia 配置完成')
}