// types/global.d.ts

/**
 * 插件配置对象
 */
interface PluginsConfig {
  /** Pinia 状态管理 */
  pinia: boolean
  /** Axios HTTP 请求 */
  axios: boolean
  /** uView Pro UI 组件库 */
  uviewPro: boolean
  /** VueUse 工具集 */
  vueuse: boolean
  /** Lodash 工具库 */
  lodash: boolean
  /** Day.js 日期处理 */
  dayjs: boolean
  /** Mitt 事件总线 */
  mitt: boolean
  /** HTTPS 支持 */
  https: boolean
}

/**
 * 未使用的占位符集合
 */
interface UnusedPlaceholders {
  /** 需要删除的 import 占位符数组 */
  import: string[]
  /** 需要删除的 use 占位符数组 */
  use: string[]
}

/**
 * 插件上下文对象
 */
interface PluginContext {
  /** 项目语言 ('ts' 或 'js') */
  language: 'ts' | 'js'
  /** 目标项目目录路径 */
  targetDir: string
  /** 当前模块目录路径 */
  __dirname: string
}

/**
 * main 文件配置项
 */
interface ConfigurationItem {
  /** 要替换的模板占位符 */
  template: string
  /** 替换后的内容 */
  content: string
}

/**
 * 包管理器类型
 */
type PackageManager = 'npm' | 'pnpm'

/**
 * pages.json easycom 配置
 */
interface EasycomConfig {
  autoscan?: boolean
  custom?: Record<string, string>
}

/**
 * pages.json 结构
 */
interface PagesJson {
  pages: Array<{
    path: string
    style?: Record<string, any>
  }>
  globalStyle?: Record<string, any>
  easycom?: EasycomConfig
  tabBar?: Record<string, any>
  [key: string]: any
}

/**
 * tsconfig.json / jsconfig.json 结构
 */
interface CompilerConfig {
  compilerOptions?: {
    types?: string[];
    [key: string]: any
  }
  [key: string]: any
}