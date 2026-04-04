// lib/plugins/axios.js
import fs from 'fs'
import path from 'path'

export async function setupAxios (language, targetDir, __dirname) {
  // 复制 Axios 模板文件（拦截器配置等）
  const axiosTemplate = language === 'ts' ? 'axios-ts' : 'axios-js'
  const srcPath = path.resolve(__dirname, `../template/${axiosTemplate}`)
  if(fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, targetDir, { recursive: true })
  }

  console.log('  ✅ Axios 配置完成')
}