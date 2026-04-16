// lib/template.js
import fs from 'fs'
import path from 'path'
import { copyTemplate } from './utils'

/**
 * 复制基础模板到目标目录
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function copyBaseTemplate (language, targetDir, __dirname) {
  const baseTemplate = language === 'ts' ? 'base-ts' : 'base-js'
  await copyTemplate(baseTemplate, targetDir, __dirname)

  // 重命名 main 文件，去掉 .tpl 后缀
  const mainTplPath = path.join(targetDir, `src/main.${language}.tpl`)
  const mainPath = path.join(targetDir, `src/main.${language}`)

  if(fs.existsSync(mainTplPath)) {
    fs.renameSync(mainTplPath, mainPath)
  }

  // 重命名 package.json，去掉 .tpl 后缀
  const pkgTplPath = path.join(targetDir, 'package.json.tpl')
  const pkgPath = path.join(targetDir, 'package.json')

  if(fs.existsSync(pkgTplPath)) {
    fs.renameSync(pkgTplPath, pkgPath)
  }
}

/**
 * 更新 index.html 中的标题
 * @param {string} projectName - 项目名称
 * @param {string} targetDir - 目标目录
 */
export async function updateIndexHtml (projectName, targetDir) {
  const indexPath = path.join(targetDir, 'index.html')
  if(!fs.existsSync(indexPath)) return
  const indexContent = fs.readFileSync(indexPath, 'utf-8')
  fs.writeFileSync(indexPath, indexContent.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`))
}