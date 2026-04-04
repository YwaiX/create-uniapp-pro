// lib/features.js
export function parseFeatures (featureList) {
  return {
    pinia: featureList.includes('pinia'),
    axios: featureList.includes('axios'),
    uviewPro: featureList.includes('uview-pro')
  }
}

export function parseExtraPlugins (featureList) {
  return featureList.filter(v => ['vueuse', 'lodash', 'dayjs', 'mitt', 'https'].includes(v))
}