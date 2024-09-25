import { log } from './logger';

/**
 * lazy-load the widgets for on-demand rendering
 *
 * @example
 * // create a new BasemapGallery widget
 * const { BasemapGallery } = await widgetLoaders.BasemapGallery()
 * const basemapGallery = new BasemapGallery()
 */
export const widgetLoaders = {
  BasemapGallery: async ()=> (await import('@arcgis/core/widgets/BasemapGallery')).default,
  Bookmarks: async ()=> (await import('@arcgis/core/widgets/Bookmarks')).default,
  Editor: async ()=> (await import('@arcgis/core/widgets/Editor')).default,
  Expand: async ()=> (await import('@arcgis/core/widgets/Expand')).default,
  Fullscreen: async ()=> (await import('@arcgis/core/widgets/Fullscreen')).default,
  Home: async ()=> (await import('@arcgis/core/widgets/Home')).default,
  LayerList: async ()=> (await import('@arcgis/core/widgets/LayerList')).default,
  LayerSearchSource: async ()=> (await import('@arcgis/core/widgets/Search/LayerSearchSource')).default,
  Legend: async ()=> (await import('@arcgis/core/widgets/Legend')).default,
  Locate: async ()=> (await import('@arcgis/core/widgets/Locate')).default,
  Measurement: async ()=> (await import('@arcgis/core/widgets/Measurement')).default,
  Popup: async ()=> (await import('@arcgis/core/widgets/Popup')).default,
  ScaleBar: async ()=> (await import('@arcgis/core/widgets/ScaleBar')).default,
  Search: async ()=> (await import('@arcgis/core/widgets/Search')).default,
  Sketch: async ()=> (await import('@arcgis/core/widgets/Sketch')).default,
}

/** type to dynamically represent widget names (keys from widget loaders) */
export type WidgetNames = keyof typeof widgetLoaders;

/** the Widget loader */
export type WidgetLoader<N extends WidgetNames> = typeof widgetLoaders[N]

/**
 * typing for a widget module, same result as: import Widget from '@arcgis/core/widgets/SomeWidget';
 */
export type WidgetModule<N extends WidgetNames> = Awaited<ReturnType<typeof widgetLoaders[N]>>

/**
 * typing to represent an instance of an esri widget
 */
export type WidgetInstance<N extends WidgetNames> = InstanceType<WidgetModule<N>>;

// note: ConstructorParameters<> returns a tuple so need to index the first parameter
/**
 * typing to extract the constructor parameters for a given widget name
 */
export type WidgetConstructorOptions<N extends WidgetNames> = ConstructorParameters<WidgetModule<N>>[0];


/**
 * configurable widget options
 */
export interface WidgetConfig<N extends WidgetNames = any> {
  /** the widget name */
  name: N;
  /** the widget constructor options */
  options?: WidgetConstructorOptions<N>;
  /** expand options, if there is something passed here
   * the target widget will be wrapped in an Expand widget
   */
  expand?: __esri.ExpandProperties;
  /**
   * view ui properties, will be used for the
   * view.ui.add() method. Can either be UI Add Position
   * object or a position string
   */
  ui?: __esri.UIAddPosition | __esri.UIAddPosition['position'];
}

type EsriViewType = __esri.MapView | __esri.SceneView;

/**
 * the loaded widget(s)
 */
export interface LoadedWidget<N extends WidgetNames = any> {
  /**
   * the target widget instance
   */
  widget: WidgetInstance<N>;
  /**
   * if wrapped in an Expand widget, the
   * Expand instance is also returned
   */
  expand?: WidgetInstance<'Expand'>;
}

/**
 * loads a widget dynamically from a given widget config
 * @param config - the configuration used to define the widget and its properties.
 * @param view - the esri View. If one is specified, the widget will be aded to the view automatically
 * @param container - the container for the widget
 * @returns the widget instance
 *
 * @example
 * loadMapWidget({
 *    name: 'Measurement',
 *    options: {
 *      activeTool: 'distance',
 *      linearUnit: 'feet',
 *      areaUnit: 'acres'
 *    },
 *    expand: {
 *      expandTooltip: 'Measure',
 *      expandIconClass: 'esri-icon-measure',
 *    },
 *    ui: 'top-right'
 *  }).then(({ widget: measurement, expand})=> { 
 *    // measurement variable is an instance of the Measurement widget
 *    measurement.label = 'Measurement' 
 *    // if expand was provided in config, "expand" is an instance of the Expand widget
 *    expand!.expand()
 *  })
 */
export function loadMapWidget<N extends WidgetNames>(config: WidgetConfig<N>, view?: EsriViewType, container?: HTMLElement | HTMLDivElement | string): Promise<LoadedWidget<N>>{
  return new Promise((resolve, reject)=> {
    const loader = widgetLoaders[config.name] as WidgetLoader<N>
    if (!loader){
      reject(`no widget registered with name: "${config.name}"`);
      return
    }

    // create widget from module loader
    loader()
      .then(async (WidgetModule)=> {
        const widget = new WidgetModule({
          ...(config.options ?? {}) as any,
          container,
          view
        }) as WidgetInstance<N>

        log(`created new "${config.name}" widget: `, widget)

        // check to see if it should be wrapped in an expand widget
        let expand: undefined | __esri.Expand = undefined;

        if (config.expand){
          const Expand = await widgetLoaders.Expand()
          expand = new Expand({
            view,
            ...config.expand!
          })

          // set expand content to widget
          expand.content = widget as __esri.Widget
          log(`wrapped "${config.name}" in an Expand widget`, expand)
        }

        // add to view
        if (view){
          view.ui.add(expand ?? widget as __esri.Widget, config.ui)
          log(`added "${config.name}" widget to view`)
        }

        resolve({ widget, expand })
      })
      .catch(err => reject(err))
  })
}
