import { ref } from 'vue'
import type { UserSettings } from "@/types";
import { getAppId } from "./config";
import { log } from './logger'

export const appIdKey = ref<string>()

export const USER_SETTINGS = 'TIMELINE_MAPPER_SETTINGS'

export function setItem(key: string, value: any){
  if (!value) return;
  if (typeof value === 'string'){
    localStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function getItem<T=string>(key: string): T | null {
  const item = localStorage.getItem(key)
  if (!item) return null;
  try {
    return JSON.parse(item) as T
  } catch(err){
    return item as T
  }
}

function getSettingsKey(){
  if (!appIdKey.value){
    const appId = getAppId()
    if (appId){
      appIdKey.value = `${USER_SETTINGS}__${appId}`
    }
    return USER_SETTINGS
  } 
  return appIdKey.value
}

export function loadUserSettings(){
  return getItem<UserSettings>(getSettingsKey()) ?? { showSplashScreen: true }
}

export function saveUserSettings(settings: Partial<UserSettings>){
  if (Object.keys(settings).length){
    setItem(getSettingsKey(), settings)
    log('saved user settings: ', settings)
  }
}