import { 
  log,
  loadMapWidget,
  type WidgetNames,
  type WidgetInstance,
  type WidgetConfig,
} from '@/utils'

/**
 * the widget info
 */
export type WidgetInfo<N extends WidgetNames = any> = {
  /** the widget type */
  type: N;
  /**
   * the widget instance
   */
  widget: WidgetInstance<N>;
  /**
   * the expand instance if the widget is wrapped in expand
   */
  expand?: __esri.Expand;
}

export const useWidgets = (view?: __esri.MapView)=> {
  const widgets: WidgetInfo[] = []
  /**
   * dynamically loads a map widget from a configuration object
   * @param config - the widget config
   * @param view - the view for the widget, defaults to view used by mapState
   * @param container - an optional container for the widget instance
   * @returns the widget info { widget, expand }
   */
  const loadWidget = async <N extends WidgetNames>(config: WidgetConfig<N>): Promise<WidgetInfo<N>>=> {
    if (!config.name) {
      console.warn('failed to load widget from config, missing "name" property: ', config)
      return {} as any
    }
    const { widget, expand } = await loadMapWidget(config, view)
    const widgetInfo = {
      widget,
      expand,
      type: config.name.split('/').slice(-1)[1] ?? widget.declaredClass.split('.').slice(-1)[0]
    } 
    log(`"${widgetInfo.type}" widget has finished loading:`, widgetInfo)
    widgets.push(widgetInfo)
    return widgetInfo as any
  }


  /**
   * loads the esri widgets from a given config
   * @param config - the application config
   * @param {__esri.MapView | __esri.SceneView} view - the esri map/scene view
   * @returns {@link IEsriWidgetInfo[]} the registered widget infos
   * 
   * @example load map widgets from a given config
   * ```ts
   * import { loadMap } from '@bmi/config-helper'
   * // local config typings
   * import { IApplicationConfig } from './types'
   * import { config } from './store' // the config object
   * 
   * async function mapLoader(){
   *   const view = await loadMap(config)
   * 
   *   // do stuff with view
   *   view.when(()=>
   *     console.log('view is ready')
   *     
   *     // load all map widgets
   *     const widgets = loadWidgets(config)
   *  )
   * }
   * ```
   */
  async function loadWidgets<Configs extends WidgetConfig<any>[]>(widgetConfigs: Configs): Promise<WidgetInfo<any>[]> {
    const widgetInfos = await Promise.all(widgetConfigs.map(loadWidget))
    log('[widgets]: loaded esri widgets: ', widgetInfos)
    return widgetInfos
  }

  /**
   * find a registered widget by type
   * @param type - the widget type
   * @returns the registered widget if found
   */
  const findWidget = <T extends WidgetNames>(type: T): WidgetInfo<T> | undefined => {
    return widgets.find(w => w.type === type || w.widget.declaredClass === `esri.widgets.${type}`)
  }

  return {
    widgets,
    findWidget,
    loadWidget,
    loadWidgets,
  }
}