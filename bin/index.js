#!/usr/bin/env node
// bin/index.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { cleanMainFile } from '../lib/cleanMain.js'
import { parsePlugins } from '../lib/features.js'
import { generatePackageJson } from '../lib/package.js'
import { setupPlugins } from '../lib/plugins/index.js'
import { askRunDev, chooseFeatures, chooseLanguage, getProjectName } from '../lib/prompts.js'
import { copyBaseTemplate, updateIndexHtml } from '../lib/template.js'
import { checkNodeVersion, detectPackageManager, runCmd } from '../lib/utils.js'

const requiredVersion = '22.19.0'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkgCommands = {
  npm: { install: 'npm install', dev: 'npm run dev:h5' },
  pnpm: { install: 'pnpm install', dev: 'pnpm dev:h5' }
}

  ; (async () => {
    // ===================== 第1步：环境检查 =====================
    checkNodeVersion(requiredVersion)
    const pkgManager = detectPackageManager()

    // ===================== 第2步：用户交互 =====================
    const projectName = await getProjectName(fs, path)
    const targetDir = path.resolve(process.cwd(), projectName)

    const language = await chooseLanguage()
    const featureList = await chooseFeatures()
    const runDev = await askRunDev(pkgCommands[pkgManager].dev)

    // ===================== 第3步：功能解析 =====================
    const plugins = parsePlugins(featureList)
    const enableHttps = plugins.https

    // ===================== 第4步：复制基础模板 =====================
    await copyBaseTemplate(language, targetDir, __dirname)
    await updateIndexHtml(projectName, targetDir)

    // ===================== 第5步：插件配置（包含模板复制 + 配置） =====================
    const unusedPlaceholders = await setupPlugins(plugins, {
      language,
      targetDir,
      __dirname
    })

    // ===================== 第6步：清理 main 文件 =====================
    await cleanMainFile(language, targetDir, unusedPlaceholders)

    // ===================== 第7步：生成 package.json =====================
    await generatePackageJson(projectName, plugins, enableHttps, language, targetDir, pkgManager)

    // ===================== 第8步：安装依赖 =====================
    runCmd(pkgCommands[pkgManager].install, targetDir)

    // ===================== 第9步：启动或提示 =====================
    if(runDev) {
      runCmd(pkgCommands[pkgManager].dev, targetDir)
    } else {
      console.log(`\n✅ 项目创建完成`)
      console.log(`👉 cd ${projectName}`)
      console.log(`👉 ${pkgCommands[pkgManager].dev}`)
      if(plugins.https) console.log('🔐 首次启用 HTTPS 会自动生成证书，请稍等...')
    }
  })()