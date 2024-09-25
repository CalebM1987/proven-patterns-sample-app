<script 
  setup 
  lang="ts" 
  generic="Config extends MapConfig"
>
import { ref, onMounted } from 'vue'
import { useMap } from '@/composables';
import type { MapConfig } from '@/types';
import type { LoadedWidget } from '@/utils';

interface Props {
  /** the map config */
  mapConfig: Config;
}

const { mapConfig } = defineProps<Props>()

const emit = defineEmits<{
  ready: [ payload: { map: __esri.Map; view: __esri.MapView; widgets: LoadedWidget<any>[] }]
}>()

const esriMap = ref<HTMLDivElement | null>(null)

onMounted(async ()=> {
  if (esriMap.value){
    const { map, view, widgets } = await useMap(esriMap.value, mapConfig)
    emit('ready', { map, view, widgets })
  }
})
</script>

<template>
  <div class="map-wrapper">
    <div class="esri-map-container" ref="esriMap"></div>
  </div>
</template>

<style>
/* @import url(https://js.arcgis.com/calcite-components/2.5.1/calcite.css); */
.map-wrapper {
  height: calc(100vh - 60px);
}

.esri-map-container {
  height: 100%;
  width: 100%;
}
</style>