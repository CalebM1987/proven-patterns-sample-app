import type { WidgetConfig, WidgetNames } from "@/utils";

export type ThemeType = 'light' | 'dark'

export interface ConfigInfo {
  id: string;
  name: string;
  path: string;
}

export interface ConfigRegistry {
  apps: ConfigInfo[];
}

export interface AppConfig {
  app: AppInfo;
  map: MapConfig;
}

export interface AppInfo {
  title: string;
  name?: string;
  logo?:  string;
  theme?: Theme;
}

export type Theme = {
  primary?: string;
  secondary?: string;
  accent?: string;
  dark?: string;
  positive?: string;
  negative?: string;
  info?: string;
  warning?: string;
}

export interface MapConfig {
  defaultPortalUrl?: string;
  /**
   * option to use an api key
   * @default false
   */
  useApiKey?: boolean;
  /**
   * the default basemap when user is in dark mode
   */
  basemapDark?: string;
  /**
   * the default basemap when the user is in light mode
   */
  basemapLight?: string;
  /**
   * the [Map properties](https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html) (if not using a webmap)
   */
  mapOptions?: __esri.MapProperties;
  /**
   * the [WebMap Properties](https://developers.arcgis.com/javascript/latest/api-reference/esri-WebMap.html)
   */
  webmap?:  __esri.WebMapProperties;
  /**
   * the [MapView properties](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html)
   */
  mapView?: Omit<__esri.MapViewProperties, 'container'>;
  /**
   * the widgets to be loaded into the map
   */
  widgets?: WidgetConfig<WidgetNames>[];
  /**
   * OAuth authentication options, if this is set, map will use
   * OAuth flow to authenticate instead of identity manager
   */
  oAuthInfo?: __esri.OAuthInfoProperties;
}