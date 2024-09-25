import type { AppConfig, ConfigInfo, ConfigRegistry } from '@/types'
import { sortByProperty } from './utils'
import { fetchJson } from './fetch'
import { log } from './logger'
import Swal from 'sweetalert2'

export const getAppId = () => {
  const url = new URL(window.location.href)
  return url.searchParams.get('app')
}

export async function loadConfig(){
  let apps = [] as ConfigInfo[]

  // check for appId in url (?app=<app-id>)
  let appId = getAppId()

  try {
    const resp = await fetchJson<ConfigRegistry>('./config/registry.yml')
    apps.push(...resp.apps)
  } catch(err){
    console.warn('error loading config file: ', err)
  }
  if (!appId){
    const sortedKeys = sortByProperty(apps, 'name')
    const options = sortedKeys.reduce((o: any, i: ConfigInfo ) => ({ ...o, [i.id]: i.name }), {})

    // wait for user input to select an app id to load
    const { value, isDismissed } = await Swal.fire({
      icon: 'warning',
      text: 'No Application ID has been provided in the URL. Please choose one from the drop down below:',
      input: 'select',
      inputOptions: options,
      inputPlaceholder: 'Select an application ID',
      showCancelButton: true
    })
    // set app ID to value
    appId = value

    // use default appID if none selected
    if (!appId || isDismissed){
      log('no application ID was selected, using first available appId')
      appId = apps[0].id
    }
  
    log('user selected appliation ID: ', appId)
    const url = new URL(window.location.href)
    url.searchParams.append('app', appId)
    const state = { additionalInformation: 'Added Application ID to url'}
    window.history.pushState(state, document.title, url.href)
  }

  const configInfo = apps.find(c => c.id === appId)

  if (!configInfo) {
    throw Error('No Configuration Found')
  }
  const configPath = `./config/${configInfo.path}`
  log(`loading config from path: "${configPath}`)
  const config = await fetchJson<AppConfig>(configPath)

  // // get app store
  // const appStore = useAppStore()

  // // set config
  // // @ts-ignore - ignore the possible infinite error (issue with esri typings)
  // appStore.config = config

  // set document title
  // document.title = config.app.title
  return config
  
}