// lib/plugins/setupPlugins.js
import { setupHttps } from './https.js'
import { setupUviewPro } from './uviewPro.js'

export function setupPlugins (features, context) {
  const { language, targetDir, enableHttps } = context

  // UI库
  if(features.uviewPro) {
    setupUviewPro(language, targetDir)
  }

  // HTTPS
  if(enableHttps) {
    setupHttps(targetDir)
  }
}