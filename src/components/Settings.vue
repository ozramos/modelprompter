<template lang="pug">
q-btn.full-width.q-pl-sm.q-pr-none(color='light' icon='settings' @click='showModal()')
  q-dialog.fullscreen(v-model='isDialogVisible')
    q-card.flex.column
      q-card-section.flex-unset
        .text-h4 Settings
      q-card-section
        p.text-h6 Cloud sync
        p
          q-toggle.q-mr-xl(v-model='isCloudSyncEnabled' label='Enable cloud sync' color='primary')
          strong(v-if='isCloudSyncEnabled') (Syncing will start once you update)
      q-card-section.flex-auto.align-stretch.q-pb-none
        p.text-h6 Local .json file
        p
          q-btn.q-mr-xl(@click='exportDatabase()') Export database
          q-btn(@click='importDatabase()') Import database


      q-card-actions.flex-unset(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(@click='updateSettings') Update Settings
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'

const $q = useQuasar()
const $router = useRouter()
const isDialogVisible = ref(false)
const isCloudSyncEnabled = ref(false)

/**
 * Shows the modal
 */
function showModal (channel = {}) {
  isDialogVisible.value = true
}
function hideModal () {
  isDialogVisible.value = false
}

/**
 * Update settings
 */
async function updateSettings () {
  await store.updateSettings({
    isCloudSyncEnabled: isCloudSyncEnabled.value
  })

  $q.notify({message: 'Settings updated'})

  hideModal()
}

/**
 * Set initial settings
 */
const settings = ref(useObservable(liveQuery(async () => {
  return await store.getSettings()
})))

onMounted(async () => {
  const settings = await store.getSettings()
  isCloudSyncEnabled.value = !!settings.isCloudSyncEnabled
})


/**
 * Export database
 */
function exportDatabase () {
  store.exportDatabase()
}

/**
 * Import database
 */
function importDatabase () {
  store.importDatabase()
}
</script>
