import { ref } from 'vue'
import { useAppStore } from "@/stores";
import { log } from './logger';
import type { ThemeType } from '@/types'
import { version as arcgisVersion } from '@arcgis/core/kernel'


export const getThemeUrl = (theme: ThemeType) => `https://js.arcgis.com/${arcgisVersion}/esri/themes/${theme}/main.css`

const esriCssUrlReg = /esri\/themes\/(light|dark)\/main\.css$/i

// create a ref to store this value
const esriCssLink = ref<HTMLLinkElement>()

/**
 * gets the esri theme link
 * @returns the html link element
 * 
 */
export function getEsriThemeLink() {
  if (!esriCssLink.value){
    let link = document.querySelector('link#esri-theme-link') as HTMLLinkElement | null;
    if (link){
      esriCssLink.value = link as HTMLLinkElement
    } else {
      log('no esri theme css link found, creating now')
      link = document.createElement('link') as HTMLLinkElement
      const appStore = useAppStore()
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('href', getThemeUrl(appStore.darkMode ? 'dark': 'light'))
      link.id = 'esri-theme-link'
      log(`set esri theme url: "${link.href}"`)
      document.head.append(link)
      esriCssLink.value = link
    }
  }
}

/**
 * finds the current esri theme
 * @returns the current theme (light or dark)
 */
export function getCurrentEsriTheme(): ThemeType {
  getEsriThemeLink()
  if (!esriCssLink.value){
    const appStore = useAppStore()
    return appStore.darkMode ? 'dark': 'light'
  }
  return esriCssUrlReg.test(esriCssLink.value.href ?? '') 
    ? esriCssUrlReg.exec(esriCssLink.value.href)![1] as ThemeType
    : 'light' // default
}

/**
 * resets the esri CSS url with the given theme
 * @param url - the url to the ArcGIS JS API css
 * @param theme - the "light" or "dark" theme
 * @returns the updated link
 */
export function setEsriThemeUrl(url: string, theme: ThemeType = 'light'): string {
  if (esriCssUrlReg.test(url)){
     return url.replace(esriCssUrlReg, `esri/themes/${theme}/main.css`)
  }
  return url
} 

/**
 * ensure's the ArcGIS JS API css is loaded and will set the appropriate theme
 * @param theme - the light or dark theme
 * @returns the html link element
 */
export function setEsriTheme(theme?: ThemeType) {
  log(`setting esri theme: "${theme}"`, esriCssLink.value)
  getEsriThemeLink()
  if(!esriCssLink.value) return;
  if (!theme){
    const appStore = useAppStore()
    theme = appStore.darkMode ? 'dark': 'light'
  }

  if (esriCssLink){
    esriCssLink.value.href = setEsriThemeUrl(esriCssLink.value.href, theme)
  }
}