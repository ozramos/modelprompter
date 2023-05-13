<template lang="pug">
q-btn(v-if='!isLoggedIn && allowLogin && connectedToCloud' @click='showModal()' icon='login') Sign in
  q-dialog(v-model='isDialogVisible')
    q-card(style='height: auto !important; min-width: 350px; max-width: 600px !important; width: auto !important;')
      q-card-section
        .text-h4 Sign in
      q-card-section
        p(v-if='allowRegistration') <strong>Regsitration isn't required</strong>, but if you want to sync across devices or invite others, login below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a> (our data store provider)
        p(v-else) <strong class='text-red'>Registration is closed.</strong> If you're in beta, sign in below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a> (our data store provider)
      q-card-actions(align='right')
        q-btn(flat @click='hideModal') Cancel
        //- q-space
        //- q-btn(color='negative' @click='deleteDatabase()') Delete Data
        q-space
        q-btn(@click='startLogin') Sign in
q-btn(v-if="isLoggedIn && allowLogin && connectedToCloud" color='negative' @click='logout()' icon='logout') Sign out
</template>


<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'

const $q = useQuasar()
const $router = useRouter()
const isDialogVisible = ref(false)
const isCloudSyncEnabled = ref(false)
const hasManuallyLoggedIn = ref(false)

const connectedToCloud = !!process.env.DEXIE_DB_URL
const allowRegistration = !!Number(process.env.ALLOW_REGISTRATION)
const allowLogin = !!Number(process.env.ALLOW_LOGIN)

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
 * Logout
 */
async function logout () {
  hideModal()
  await store.db.$logins.clear()
  $q.notify({message: 'Logged out'})
}

/**
 * Shows the modal
 */
function showModal () {
  isDialogVisible.value = true
}
function hideModal () {
  isDialogVisible.value = false
}

/**
 * Login
 */
function startLogin () {
  hideModal()
  store.db.cloud.login()
  hasManuallyLoggedIn.value = true
}
</script>
