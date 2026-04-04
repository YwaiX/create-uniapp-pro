import { createSSRApp } from "vue"
import App from "./App.vue"
/* __PINIA_IMPORT__ */
/* __UVIEWPRO_IMPORT__ */

export function createApp () {
  const app = createSSRApp(App)
  /* __PINIA_USE__ */
  /* __UVIEWPRO_USE__ */
  
  return {
    app,
  }
}
