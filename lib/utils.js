// lib/utils.js
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * 检查 Node.js 版本是否符合要求
 * @param {string} requiredVersion - 要求的版本号，如 "16.0.0"
 */
export function checkNodeVersion (requiredVersion) {
  const currentVersion = process.version.replace('v', '')
  if(compareVersion(currentVersion, requiredVersion) < 0) {
    console.error(`❌ Node.js 版本过低`)
    console.error(`当前版本: ${currentVersion}`)
    console.error(`最低要求: ${requiredVersion}`)
    console.error(`请升级 Node.js 后再运行`)
    process.exit(1)
  }
}

/**
 * 比较两个版本号
 * @param {string} v1 - 版本号1
 * @param {string} v2 - 版本号2
 * @returns {-1 | 0 | 1} 1: v1 > v2, -1: v1 < v2, 0: 相等
 */
export function compareVersion (v1, v2) {
  const a = v1.split('.').map(Number)
  const b = v2.split('.').map(Number)
  for(let i = 0; i < Math.max(a.length, b.length); i++) {
    const n1 = a[i] || 0
    const n2 = b[i] || 0
    if(n1 > n2) return 1
    if(n1 < n2) return -1
  }
  return 0
}

/**
 * 检测使用的包管理器
 * @returns {PackageManager} 包管理器类型 ('npm' 或 'pnpm')
 */
export function detectPackageManager () {
  const userAgent = process.env.npm_config_user_agent || ''
  if(userAgent.startsWith('pnpm')) return 'pnpm'
  if(userAgent.startsWith('npm')) return 'npm'
  if(fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  return 'npm'
}

/**
 * 执行命令
 * @param {string} cmd - 要执行的命令
 * @param {string} [cwd=process.cwd()] - 工作目录
 */
export function runCmd (cmd, cwd = process.cwd()) {
  execSync(cmd, { cwd, stdio: 'inherit' })
}

/**
 * 复制模板目录到目标位置
 * @param {string} templateName - 模板名称
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function copyTemplate (templateName, targetDir, __dirname) {
  const srcPath = path.resolve(__dirname, `../template/${templateName}`)
  if(fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, targetDir, { recursive: true })
  }
}

/**
 * 配置 main 文件（替换模板占位符）
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {ConfigurationItem[]} configuration - 配置项数组
 */
export async function configurationMain (language, targetDir, configuration) {
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!fs.existsSync(mainPath)) return

  let content = fs.readFileSync(mainPath, 'utf-8')
  for(const item of configuration) {
    content = content.replace(item.template, item.content)
  }
  fs.writeFileSync(mainPath, content)
}