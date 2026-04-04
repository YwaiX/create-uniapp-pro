# ⚡ create-uniapp

🚀 一个开箱即用的 UniApp 项目快速生成工具  
基于官方模板二次封装，支持按需组合常用技术栈，直接生成可落地的 App / 小程序项目结构。

---

## ✨ 特性一览

- ⚡ 基于 UniApp + Vite，开发体验丝滑
- 📱 一套代码多端运行（H5 / App / 小程序）
- 📜 支持 JavaScript / TypeScript 自由选择
- 🗂️ 可选集成 Pinia（含持久化）
- 📡 内置 Axios 请求封装方案（含请求缓存）
- 🎨 可选集成 uView Pro UI 组件库（自动配置）
- 🧰 常用工具库可选：VueUse / Lodash / Day.js
- 🔔 可选集成 Mitt（事件总线）
- 🛡️ 可选集成 mkcert，实现本地 HTTPS
- 🧩 自动配置 easycom（组件免引入）
- 🟢 支持 npm / pnpm 自动识别
- 🧱 模块化设计，易扩展脚手架能力

---

## 🧩 技术栈

📱 UniApp  
⚡ Vite  
🟢 Vue 3  
📜 JavaScript / 🔷 TypeScript  
🗂️ Pinia  
📡 Axios  
🎨 uView Pro  
🧰 VueUse · Lodash · Day.js  
🔔 Mitt  
🛡️ mkcert (本地 HTTPS)

---

## 📦 生成后的项目包含什么？

根据你的选择，工具会自动生成一个标准化 UniApp 项目结构：

### 基础内容（必选）

- UniApp 项目基础结构（pages.json / manifest.json）
- src 源码目录
- 项目入口文件（main.js / main.ts）
- 根组件 App.vue
- 全局样式 uni.scss
- Vite 配置文件
- 自动注入依赖（按选择功能）
- easycom 自动配置
- 路径别名（@ → src）

---

## 📁 项目目录结构说明

> project-name  
>
> ├─ node_modules/  
>
> ├─ src/  
> │  ├─ api/  
> │  │   └─ index.(js/ts)          —— 接口统一出口  
> │  ├─ pages/  
> │  │   └─ index/  
> │  │       └─ index.vue          —— 首页  
> │  ├─ static/  
> │  │   └─ logo.png               —— 静态资源  
> │  ├─ stores/  
> │  │   └─ index.(js/ts)          —— Pinia（可选）  
> │  ├─ utils/  
> │  │   ├─ request.(js/ts)        —— Axios 封装  
> │  │   └─ requestCache.(js/ts)   —— 请求缓存  
> │  ├─ App.vue                    —— 根组件  
> │  ├─ main.(js/ts)               —— 项目入口  
> │  ├─ env.d.ts                   —— 环境变量类型（仅 TS）  
> │  ├─ shime-uni.d.ts             —— UniApp 类型补充  
> │  ├─ pages.json                 —— 页面配置  
> │  ├─ manifest.json              —— 平台配置  
> │  └─ uni.scss                   —— 全局样式  
> 
> ├─ .env                          —— 环境变量  
> ├─ index.html                    —— H5 入口  
> ├─ package.json                  —— 依赖管理  
> ├─ package-lock.json             —— 锁文件  
> ├─ tsconfig.json / jsconfig.json —— 编译配置  
>├─ shims-uni.d.ts                —— 全局类型声明  
> └─ vite.config.(js/ts)           —— Vite 配置  

---

## 🧠 说明补充

- `api/`：接口统一管理  
- `utils/request`：Axios 封装（支持拦截器 + 缓存）  
- `stores/`：Pinia 状态管理（按需生成）  
- `static/`：静态资源目录  
- `pages.json`：UniApp 页面路由配置（⚠️ 非 Vue Router）  
- `manifest.json`：App / 小程序配置  
- `uni.scss`：全局样式 + uView 主题入口  

---

## ⚙️ 使用方式（多包管理器支持）

1. 创建项目  

```bash
npm create vite-vue@latest
pnpm create vite-vue@latest
```

2. 进入项目目录  

```bash
cd 项目名
```

3. 安装依赖  (可省略)

```bash
npm install
pnpm install
```

4. 启动开发环境  

```bash
npm run dev
pnpm dev
```

---

## 🔧 常见需要调整的地方（具体文件示例）

### 1️⃣ 接口请求地址

文件：`src/utils/request.ts` / `src/utils/request.js`  

```ts
import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 修改为你的接口地址
  timeout: 10000,
});

// 示例请求
export const getUserList = () => service.get('/users');

export default service;
```

> 🔹 根据实际业务修改 `baseURL` 和各个接口方法。  

---

### 2️⃣ 本地代理配置

文件：`vite.config.ts` / `vite.config.js`  

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 修改为后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

> 🔹 如果接口路径前有 `/api` 前缀，可通过代理去掉  
> 🔹 根据本地后端环境调整 `target`  

---

### 3️⃣ Mitt 事件总线使用示例

#### 封装事件总线

文件：`src/utils/eventBus.ts`

```ts
import mitt from 'mitt'

type Events = {
  userLogin: { name: string },
  userLogout: null
}

const emitter = mitt<Events>()

export default emitter
```

#### 使用示例

##### 组件 A（发送事件）

```ts
<script setup lang="ts">
import eventBus from '@/utils/eventBus'

function login() {
  eventBus.emit('userLogin', { name: '张三' })
}
</script>
```

##### 组件 B（接收事件）

```ts
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import eventBus from '@/utils/eventBus'

function handleLogin(payload: { name: string }) {
  console.log('用户登录:', payload.name)
}

onMounted(() => {
  eventBus.on('userLogin', handleLogin)
})

onUnmounted(() => {
  eventBus.off('userLogin', handleLogin)
})
</script>
```

> 🔹 Mitt 事件总线轻量高效，适合组件间解耦通信，替代父子传递 props / emit 或 Vuex/Pinia 中的小型事件场景。

---

## 🎯 适用场景

- UniApp App 开发
- 小程序开发
- 跨端项目
- 毕设 / 实战项目

---

## 🌐 技术栈官网链接

- [uni-app](https://uniapp.dcloud.net.cn/)
- [Vite | 下一代的前端工具链](https://cn.vitejs.dev/)
- [Vue.js - 渐进式 JavaScript 框架 | Vue.js](https://cn.vuejs.org/)
- [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Pinia | The intuitive store for Vue.js](https://pinia.vuejs.org/zh/)
- [Axios](https://www.axios-http.cn/)
- [uView Pro | 多平台快速开发 UI 框架 | uView Pro](https://uviewpro.cn/)
- [VueUse](https://vueuse.pages.dev/)
- [Lodash](https://www.lodashjs.com/)
- [Day.js](https://day.js.org/)  
- [Mitt](https://github.com/developit/mitt)  

---

## 📄 License

MIT License
