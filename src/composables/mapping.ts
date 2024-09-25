import { watch } from 'vue'
import type { MapConfig } from "@/types";
import { useAppStore } from "@/stores";
import { useWidgets } from "./widgets";
import { log, setEsriTheme } from "@/utils";
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import Map from '@arcgis/core/Map'
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config'

export interface IdentityManagerJSON {
  serverInfos?: __esri.ServerInfoProperties[];
  credentials?: __esri.CredentialProperties[];
  oAuthInfos?: __esri.OAuthInfoProperties[];
}

// @ts-ignor
const apiKey = import.meta.env.VITE_APP_API_KEY

export async function useMap(container: HTMLDivElement, options: MapConfig){
  log('[mapping]: useMap called with config: ', options)
  const appState = useAppStore()

  if (appState.config.map.useApiKey && apiKey){
    esriConfig.apiKey = apiKey
    log('set api key')
  }

  const credKey = 'SAMPLE_APP_SESSION'
  IdentityManager.on('credential-create', (evt)=> {
    log('created esri credential: ', evt)
    localStorage.setItem(credKey, IdentityManager.toJSON())
  })

  // check for existing cached credentials
  const credCache = localStorage.getItem(credKey)
  if (credCache){
    log('found cached credentials, initializing from cache now')
    IdentityManager.initialize(JSON.parse(credCache))
  }

  // check for oAuth Info
  if (options.oAuthInfo){
    const oauthInfo = new OAuthInfo(options.oAuthInfo)
    IdentityManager.registerOAuthInfos([oauthInfo])
  }

  // check for default basemap based on theme
  const basemap = options.basemapDark && appState.darkMode 
    ? options.basemapDark
    : options.basemapLight && !appState.darkMode   
      ? options.basemapLight
      : undefined
  
  // override default basemap based on theme
  if (basemap){
    log(`overriding "${appState.userSettings.theme}" theme basemap: "${basemap}"`)
    if (options.webmap){
      options.webmap.basemap = basemap
    } else {
      options.mapOptions = options.mapOptions ?? {}
      options.mapOptions.basemap = basemap
    }
  }

  // load map or webmap based on config
  const map: __esri.Map | __esri.WebMap = options.webmap 
    ? new WebMap(options.webmap)
    : new Map(options.mapOptions)
  log('created map: ', map)

  const view = new MapView({
    ...options.mapView ?? {},
    container,
    map
  })
  log('created view: ', view)

  // watch for theme changes
  watch(()=> appState.userSettings.theme,
    (theme)=> {
      setEsriTheme(theme)
      const newBasemap = theme === 'dark' ? options.basemapDark : options.basemapLight
      if (newBasemap){
        map.basemap = newBasemap as any
      }
    },
    { immediate: true }
  )

  // load map widgets
  const { widgets, loadWidgets, findWidget } = useWidgets(view)
  await loadWidgets(options.widgets ?? [])
  log('loaded all widgets: ', widgets)

  return { map, view, widgets, findWidget }
}