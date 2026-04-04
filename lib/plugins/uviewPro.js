// lib/plugins/uviewPro.js
import fs from 'fs'
import path from 'path'

// ================== 主入口 ==================
export function setupUviewPro (language, targetDir) {
  injectGlobalScss(targetDir)
  injectAppVueStyle(targetDir)
  injectEasycom(targetDir)
  injectTypes(language, targetDir)
}

// ================== 1. uni.scss ==================
function injectGlobalScss (targetDir) {
  const filePath = path.join(targetDir, 'src/uni.scss')
  if(!fs.existsSync(filePath)) return

  let content = fs.readFileSync(filePath, 'utf-8')

  if(content.includes("uview-pro/theme.scss")) return

  content = `@import "uview-pro/theme.scss";\n${content}`

  fs.writeFileSync(filePath, content)
}

// ================== 2. App.vue ==================
function injectAppVueStyle (targetDir) {
  const filePath = path.join(targetDir, 'src/App.vue')
  if(!fs.existsSync(filePath)) return

  let content = fs.readFileSync(filePath, 'utf-8')

  if(content.includes("uview-pro/index.scss")) return

  content = content.replace(
    /<style[^>]*>/,
    match => `${match}\n@import "uview-pro/index.scss";`
  )

  fs.writeFileSync(filePath, content)
}

// ================== 3. easycom ==================
function injectEasycom (targetDir) {
  const filePath = path.join(targetDir, 'src/pages.json')
  if(!fs.existsSync(filePath)) return

  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  if(!json.easycom) json.easycom = {}

  json.easycom.autoscan = true

  if(!json.easycom.custom) json.easycom.custom = {}

  json.easycom.custom['^u-(.*)'] = 'uview-pro/components/u-$1/u-$1.vue'

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

// ================== 4. types ==================
function injectTypes (language, targetDir) {
  const configName = language === 'ts' ? 'tsconfig.json' : 'jsconfig.json'
  const filePath = path.join(targetDir, configName)

  if(!fs.existsSync(filePath)) return

  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  if(!json.compilerOptions) json.compilerOptions = {}

  if(!json.compilerOptions.types) {
    json.compilerOptions.types = []
  }

  if(!json.compilerOptions.types.includes('uview-pro/types')) {
    json.compilerOptions.types.push('uview-pro/types')
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}