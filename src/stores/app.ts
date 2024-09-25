import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { AppConfig, UserSettings } from '@/types'

export const useAppStore = defineStore('app', () => {

  const config = ref<AppConfig>({} as any)

  const userSettings = useStorage<UserSettings>('sample-app-settings', 
    {
      theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }, 
    localStorage,
    { mergeDefaults: true } 
  )

  const darkMode = computed({
    get(){
      return userSettings.value?.theme === 'dark'
    },
    set(val: boolean){
      userSettings.value.theme = val ? 'dark': 'light'
    }
  })

  return {
    /**  have to do explicitly type this because the esri typings
    * are infinitely recursive
    */
    config: config as Ref<AppConfig>,
    userSettings,
    darkMode,
  }

})