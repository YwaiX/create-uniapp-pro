// lib/package.js
import fs from 'fs'
import path from 'path'

export function generatePackageJson (projectName, features, extraPlugins, enableHttps, language, targetDir, pkgManager) {
  const pkgTpl = path.join(targetDir, 'package.json.tpl')
  if(!fs.existsSync(pkgTpl)) return
  let pkg = fs.readFileSync(pkgTpl, 'utf-8')

  const optionalDeps = {}
  if(features.pinia) {
    optionalDeps['pinia'] = '^3.0.4'
    optionalDeps['pinia-plugin-persistedstate'] = '^4.7.1'
  }
  if(features.axios) optionalDeps['axios'] = '^1.13.6'
  if(features.uviewPro) {
    optionalDeps['sass'] = '1.63.2'
    optionalDeps['sass-loader'] = '10.4.1'
    optionalDeps['uview-pro'] = '^0.5.16'
  }
  if(extraPlugins.includes('vueuse')) optionalDeps['@vueuse/core'] = '^14.2.1'
  if(extraPlugins.includes('dayjs')) optionalDeps['dayjs'] = '^1.11.20'
  if(extraPlugins.includes('lodash')) optionalDeps['lodash'] = '^4.17.23'
  if(extraPlugins.includes('mitt')) optionalDeps['mitt'] = '^3.0.1'
  if(enableHttps) optionalDeps['vite-plugin-mkcert'] = '^1.17.10'

  const keys = Object.keys(optionalDeps)
  const depsStr = keys.length ? ',\n' + keys.map(k => `    "${k}": "${optionalDeps[k]}"`).join(',\n') : ''
  pkg = pkg.replace('__PROJECT_NAME__', projectName).replace('__OPTIONAL_DEP__', depsStr)

  const pkgObj = JSON.parse(pkg)

  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgObj, null, 2))
  fs.unlinkSync(pkgTpl)
}