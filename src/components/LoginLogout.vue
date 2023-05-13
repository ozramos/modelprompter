<template lang="pug">
q-btn(v-if='allowLogin && connectedToCloud' @click='showModal()' icon='login') Sync to cloud
  q-dialog(v-model='isDialogVisible')
    q-card(style='height: auto !important; min-width: 350px; max-width: 600px !important; width: auto !important;')
      q-card-section
        .text-h4 Login
      q-card-section
        p(v-if='allowRegistration') <strong>Regsitration isn't required</strong>, but if you want to sync across devices or invite others, login below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a>
        p(v-else) <strong class='text-red'>Registration is closed.</strong> But you can login below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a>
      q-card-actions(align='right')
        q-btn(flat @click='hideModal') Cancel
        //- q-space
        //- q-btn(color='negative' @click='deleteDatabase()') Delete Data
        q-space
        q-btn(@click='startLogin') Login
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'

const $q = useQuasar()
const $router = useRouter()
const isDialogVisible = ref(false)
const isCloudSyncEnabled = ref(false)

const connectedToCloud = !!process.env.DEXIE_DB_URL
const allowRegistration = !!Number(process.env.ALLOW_REGISTRATION)
const allowLogin = !!Number(process.env.ALLOW_LOGIN)

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
  console.log('startLogin')
}
</script>
