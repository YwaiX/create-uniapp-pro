// lib/features.js

/**
 * 解析功能列表为插件配置对象
 * @param {string[]} featureList - 选择的功能列表，如 ['pinia', 'axios']
 * @returns {PluginsConfig} 插件配置对象
 */
export function parsePlugins (featureList) {
  return {
    // 核心插件
    pinia: featureList.includes('pinia'),
    axios: featureList.includes('axios'),

    // UI 插件
    uviewPro: featureList.includes('uview-pro'),

    // 工具插件
    vueuse: featureList.includes('vueuse'),
    lodash: featureList.includes('lodash'),
    dayjs: featureList.includes('dayjs'),
    mitt: featureList.includes('mitt'),

    // 开发工具
    https: featureList.includes('https')
  }
}