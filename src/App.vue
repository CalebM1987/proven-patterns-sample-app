<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useAppStore } from '@/stores'
import { log } from '@/utils'
import type { LoadedWidget } from '@/utils';
import DarkModeToggle from './components/DarkModeToggle.vue';
const MapViewer = defineAsyncComponent(()=> import('@/views/MapViewer.vue'))

const appStore = useAppStore()

const onMapReady = (evt: { map: __esri.Map; view: __esri.MapView; widgets: LoadedWidget[] })=> {
  const { map, view, widgets } = evt
  log('map viewer is ready: ', map, view, widgets)
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title v-if="appStore.config.app">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          {{ appStore.config.app.name }} - {{ appStore.config.app.title }}
        </q-toolbar-title>
        <DarkModeToggle />
      </q-toolbar>
    </q-header>

    <q-page-container class="main-container">
      <div class="column">
        <Suspense>
          <MapViewer
            :map-config="(appStore.config.map as any)"
            @ready="onMapReady"
          />
          <template #fallback>
            <div class="col-8 self-center">
              <q-spinner-facebook
                class="p-pa-xl"
                color="primary"
                size="6em"
                style="margin-top: 40vh"
              />
            </div>
          </template>
        </Suspense>
      </div>
    </q-page-container>

  </q-layout>
</template>

<style scoped>
</style>
