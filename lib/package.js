// lib/package.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

/**
 * 生成 package.json 文件
 * @param {string} projectName - 项目名称
 * @param {PluginsConfig} plugins - 插件配置对象
 * @param {boolean} enableHttps - 是否启用 HTTPS
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {PackageManager} pkgManager - 包管理器类型
 */
export async function generatePackageJson (projectName, plugins, enableHttps, language, targetDir, pkgManager) {
  const pkgPath = path.join(targetDir, 'package.json')

  if(!existsSync(pkgPath)) {
    throw new Error(`package.json 不存在: ${pkgPath}`)
  }

  let pkgContent = await fs.readFile(pkgPath, 'utf-8')

  const optionalDeps = {}

  // 核心插件
  if(plugins.pinia) {
    optionalDeps['pinia'] = '^3.0.4'
    optionalDeps['pinia-plugin-persistedstate'] = '^4.7.1'
  }
  if(plugins.axios) optionalDeps['axios'] = '^1.13.6'

  // UI 插件
  if(plugins.uviewPro) {
    optionalDeps['sass'] = '1.63.2'
    optionalDeps['sass-loader'] = '10.4.1'
    optionalDeps['uview-pro'] = '^0.5.16'
  }

  // 工具插件
  if(plugins.vueuse) optionalDeps['@vueuse/core'] = '^14.2.1'
  if(plugins.dayjs) optionalDeps['dayjs'] = '^1.11.20'
  if(plugins.lodash) optionalDeps['lodash'] = '^4.17.23'
  if(plugins.mitt) optionalDeps['mitt'] = '^3.0.1'

  // 开发工具
  if(enableHttps) optionalDeps['vite-plugin-mkcert'] = '^1.17.10'

  const depsKeys = Object.keys(optionalDeps)
  let depsStr = ''

  if(depsKeys.length > 0) {
    depsStr = ',\n' + depsKeys.map(k => `    "${k}": "${optionalDeps[k]}"`).join(',\n')
  }

  pkgContent = pkgContent.replace('__PROJECT_NAME__', projectName)
  pkgContent = pkgContent.replace('__OPTIONAL_DEP__', depsStr)

  const pkgObj = JSON.parse(pkgContent)

  // uni-app 特有的 pnpm 配置（如果需要）
  if(pkgManager === 'pnpm') {
    // 可以添加 uni-app 相关的 pnpm 配置
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkgObj, null, 2))
  console.log('  ✅ package.json 生成完成')
}