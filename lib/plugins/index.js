// lib/plugins/index.js
import { setupAxios } from './axios.js'
import { setupHttps } from './https.js'
import { setupPinia } from './pinia.js'
import { setupUviewPro } from './uviewPro.js'

/**
 * 配置所有选中的插件
 * @param {PluginsConfig} plugins - 插件配置对象
 * @param {PluginContext} context - 上下文对象
 * @returns {Promise<UnusedPlaceholders>} 未使用的占位符集合
 */
export async function setupPlugins (plugins, context) {
  const { language, targetDir, __dirname } = context

  // 收集未使用的占位符
  const unusedPlaceholders = {
    import: [],
    use: []
  }

  console.log('\n🔌 配置插件...\n')

  // ==================== Pinia 配置 ====================
  if(plugins.pinia) {
    await setupPinia(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __PINIA_IMPORT__ */')
    unusedPlaceholders.use.push('/* __PINIA_USE__ */')
  }

  // ==================== Axios 配置 ====================
  if(plugins.axios) {
    await setupAxios(language, targetDir, __dirname)
  }

  // ==================== uView Pro 配置 ====================
  if(plugins.uviewPro) {
    await setupUviewPro(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __UVIEWPRO_IMPORT__ */')
    unusedPlaceholders.use.push('/* __UVIEWPRO_USE__ */')
  }

  // ==================== HTTPS 配置 ====================
  if(plugins.https) {
    await setupHttps(targetDir, __dirname)
  }

  return unusedPlaceholders
}