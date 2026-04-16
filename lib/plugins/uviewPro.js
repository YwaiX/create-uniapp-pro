// lib/plugins/uviewPro.js
import fs from 'fs'
import path from 'path'
import { configurationMain } from '../utils'

/**
 * 配置 uView Pro UI 组件库
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupUviewPro (language, targetDir, __dirname) {
  // 1. 注入 uni.scss
  const uniScssPath = path.join(targetDir, 'src/uni.scss')
  if(fs.existsSync(uniScssPath)) {
    let content = fs.readFileSync(uniScssPath, 'utf-8')
    if(!content.includes("uview-pro/theme.scss")) {
      content = `@import "uview-pro/theme.scss";\n${content}`
      fs.writeFileSync(uniScssPath, content)
    }
  }

  // 2. 注入 App.vue 样式
  const appVuePath = path.join(targetDir, 'src/App.vue')
  if(fs.existsSync(appVuePath)) {
    let content = fs.readFileSync(appVuePath, 'utf-8')
    if(!content.includes("uview-pro/index.scss")) {
      content = content.replace(
        /<style[^>]*>/,
        match => `${match}\n@import "uview-pro/index.scss";`
      )
      fs.writeFileSync(appVuePath, content)
    }
  }

  // 3. 配置 easycom
  const pagesJsonPath = path.join(targetDir, 'src/pages.json')
  if(fs.existsSync(pagesJsonPath)) {
    const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'))
    if(!pagesJson.easycom) pagesJson.easycom = {}
    pagesJson.easycom.autoscan = true
    if(!pagesJson.easycom.custom) pagesJson.easycom.custom = {}
    pagesJson.easycom.custom['^u-(.*)'] = 'uview-pro/components/u-$1/u-$1.vue'
    fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesJson, null, 2))
  }

  // 4. 配置 TypeScript 类型
  const configName = language === 'ts' ? 'tsconfig.json' : 'jsconfig.json'
  const configPath = path.join(targetDir, configName)

  if(fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    if(!config.compilerOptions) config.compilerOptions = {}
    if(!config.compilerOptions.types) config.compilerOptions.types = []
    if(!config.compilerOptions.types.includes('uview-pro/types')) {
      config.compilerOptions.types.push('uview-pro/types')
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  }

  // 5. 修改 main 文件，注入 uview-pro
  const uviewProImport = `import uViewPro from 'uview-pro'`
  const uviewProUse = `app.use(uViewPro)`

  let array = [
    {
      template: '/* __UVIEWPRO_IMPORT__ */',
      content: uviewProImport
    },
    {
      template: '/* __UVIEWPRO_USE__ */',
      content: uviewProUse
    }
  ]
  configurationMain(language, targetDir, array)

  console.log('  ✅ uView Pro 配置完成')
}