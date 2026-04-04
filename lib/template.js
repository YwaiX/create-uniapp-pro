// lib/template.js
import fs from 'fs'
import path from 'path'

export async function copyBaseTemplate (language, targetDir, __dirname) {
  const baseTemplate = language === 'ts' ? 'base-ts' : 'base-js'
  const srcPath = path.resolve(__dirname, `../template/${baseTemplate}`)

  // 复制整个模板目录
  fs.cpSync(srcPath, targetDir, { recursive: true })

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

export async function updateIndexHtml (projectName, targetDir) {
  const indexPath = path.join(targetDir, 'index.html')
  if(!fs.existsSync(indexPath)) return
  const indexContent = fs.readFileSync(indexPath, 'utf-8')
  fs.writeFileSync(indexPath, indexContent.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`))
}