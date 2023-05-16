<template lang="pug">
q-btn.full-width.q-pl-sm.q-pr-none(color='light' icon='settings' @click='showModal()')
  q-dialog(v-model='isDialogVisible')
    q-card(style='height: auto !important; max-width: 100% !important; width: 500px !important;')
      q-card-section
        .text-h4 Settings
      q-card-section(v-if='connectedToCloud && allowRegistration')
        p.text-h6 Cloud sync
        p(v-if='isLoggedIn')
          p syncing
          q-toggle.q-mr-xl(v-model='isCloudSyncEnabled' label='Enable cloud sync' color='primary')
          strong(v-if='isCloudSyncEnabled') (Syncing will start once you update)
        p(v-else)
          LoginLogout (Registration will be available soon)
      q-card-section
        p.text-h6 Local .json file
        q-card-actions.q-px-none
          q-btn.q-mr-md(@click='exportDatabase()') Export
          label.q-btn.bg-light.text-white.non-selectable.no-outline.q-btn--standard.q-btn--rectangle.q-btn--actionable.q-focusable.q-hoverable(for='jsonFile' color='light' style='line-height: 2.5em') Import
          input.hidden(type='file' id='jsonFile' accept='.json' style='display: none' @change='ev => importDatabase(ev)')


      q-card-actions.q-mt-xl(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(color='negative' @click='deleteDatabase()') Delete
        q-space
        q-btn(@click='updateSettings') Update Settings
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import LoginLogout from '/src/components/LoginLogout.vue'

const $q = useQuasar()
const $router = useRouter()
const isDialogVisible = ref(false)
const isCloudSyncEnabled = ref(false)
let jsonFile = ref(null)
const connectedToCloud = !!process.env.DEXIE_DB_URL
const allowRegistration = !!Number(process.env.ALLOW_REGISTRATION)

/**
 * Listen for logged in user change
 */
const isLoggedIn = ref(false)
const user = ref(useObservable(store.db?.cloud?.currentUser || {}))

watch(user, () => {
  isLoggedIn.value = store.db.cloud.currentUserId && store.db.cloud.currentUserId !== 'unauthorized'

  if (hasManuallyLoggedIn.value && isLoggedIn.value) {
    $q.notify({message: 'Logged in'})
  }
})

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
async function importDatabase (ev) {
  if (!ev.target.files.length) return
  await store.importDatabase(ev.target.files[0], $q)
  $router.push('/')
  hideModal()
}

/**
 * Delete database
 */
async function deleteDatabase () {
  await store.deleteDatabase()
  $router.push('/')
  window.location.reload()
}
</script>
