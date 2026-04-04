// lib/mainFile.js
import fs from 'fs'
import path from 'path'

export async function generateMainFile (features, extraPlugins, language, targetDir) {
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainTplPath = path.join(targetDir, `src/${mainFile}.tpl`)
  if(!fs.existsSync(mainTplPath)) return
  let main = fs.readFileSync(mainTplPath, 'utf-8')

  const replacements = {
    '/* __PINIA_IMPORT__ */': features.pinia ? "import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'" : '',
    '/* __PINIA_USE__ */': features.pinia ? 'app.use(createPinia().use(persistedstate))' : '',
    '/* __UVIEWPRO_IMPORT__ */': features.uviewPro ? "import uViewPro from 'uview-pro'" : '',
    '/* __UVIEWPRO_USE__ */': features.uviewPro ? 'app.use(uViewPro)' : ''
  }

  function escapeRegExp (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  for(const [placeholder, content] of Object.entries(replacements)) {
    if(content) main = main.replace(placeholder, content)
    else main = main.replace(new RegExp(`^\\s*${escapeRegExp(placeholder)}\\s*$\\n?`, 'gm'), '')
  }

  main = main.replace(/(\s*)const app = createSSRApp\(App\)/, '$1const app = createSSRApp(App)')
  main = main.replace(/\n{3,}/g, '\n\n')

  fs.writeFileSync(path.join(targetDir, `src/${mainFile}`), main)
  fs.unlinkSync(mainTplPath)
}