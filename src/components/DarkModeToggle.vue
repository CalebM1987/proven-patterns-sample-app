<script lang="ts" setup>
import { useAppStore } from '@/stores'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia';

const { darkMode } = storeToRefs(useAppStore())

// set dark mode initially
const $q = useQuasar()
$q.dark.set(darkMode.value)
</script>

<template>
  <div class="dark-mode-toggle q-pa-md">
    <q-toggle 
      class="text-center"
      :title="`toggle ${darkMode ? 'light': 'dark'} mode`"
      :color="darkMode ? 'dark': undefined"
      v-model="darkMode" 
      checked-icon="dark_mode"
      unchecked-icon="light_mode"
    />
  </div>
</template>
