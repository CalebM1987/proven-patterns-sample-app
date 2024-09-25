import { createApp } from 'vue'
import { Quasar, Dark, Loading } from 'quasar'
import { loadConfig } from '@/utils'
import { createPinia } from 'pinia'
// import { useAppStore } from '@/stores'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// default quasar color palette
const defaultTheme = {
  primary: '#1976D2',
  secondary: '#26A69A',
  accent: '#9C27B0',
  dark: '#1D1D1D',
  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037',
}

// main function to initialize app
async function main(){

  const config = await loadConfig()
  console.log('CONFIG: ', config)

  // get app store - have to load this after createPinia()
  const { useAppStore } = await import('./stores')

  const App = (await import('./App.vue')).default

  const myApp = createApp(App)
  
  myApp
    .use(createPinia())
    .use(Quasar, {
      config: {
        brand: config.app.theme ?? defaultTheme
      },
      plugins: {
        Dark,
        Loading
      }, // import Quasar plugins and add here
    })
  
  // Assumes you have a <div id="app"></div> in your index.html
  myApp.mount('#app')

  
  const appStore = useAppStore()
  console.log('store;;;;', appStore, config)

  // set config
  appStore.config = config
}

main()

