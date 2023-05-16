<template lang="pug">
q-btn(v-if='!isLoggedIn && allowLogin && connectedToCloud' @click='showModal()' icon='login') Sign in
  q-dialog(v-model='isDialogVisible')
    //- Get Email
    q-card(v-if='!hasSentEmail' style='height: auto !important; min-width: 350px; max-width: 600px !important; width: auto !important;')
      q-card-section
        .text-h4 Sign in
      q-card-section
        p(v-if='allowRegistration') <strong>Regsitration isn't required</strong>, but if you want to sync across devices or invite others, login below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a> (our data store provider)
        p(v-else) <strong class='text-red'>Registration is closed.</strong> If you're in beta, sign in below to get an access token emailed from <a href="https://dexie.org/cloud" target="_blank">Dexie Cloud</a> (our data store provider)
        div
          q-input(ref='$email' v-model='email' label='Email' type='email' :disabled='isWaitingForOTP')
      q-card-actions(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(@click='startLogin' :loading='isWaitingForOTP') Email access token

    //- Get OTP
    q-card(v-else style='height: auto !important; min-width: 350px; max-width: 600px !important; width: auto !important;')
      q-card-section
        .text-h4 Enter OTP
        p Check your email for an access token from Dexie.org (the cloud provider for this app) and enter the token below
        div
          q-input(ref='$email' v-model='email' label='Email' type='email' :disabled='isWaitingForOTP')
        div
          q-input(ref='$otpToken' v-model='otpToken' label='Enter OTP token')
      q-card-actions(align='right')
        q-btn(flat @click='hideModal') Cancel
        //- q-space
        q-space
        q-btn(@click='loginWithOTP()' :disabled='!email || !otpToken' :loading='isLoggingInWithOTP') Login

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
const hasSentEmail = ref(false)
const email = ref('')
const $email = ref(null)
const $otpToken = ref('')
const otpToken = ref('')
const otpData = ref(null)
const isWaitingForOTP = ref(false)
const isLoggingInWithOTP = ref(false)

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
async function showModal () {
  isDialogVisible.value = true
  hasSentEmail.value = false
  isWaitingForOTP.value = false
  hasManuallyLoggedIn.value = false

  nextTick(() => {
    setTimeout(() => {
      $email.value.focus()
    }, 10)
  })
}
function hideModal () {
  isDialogVisible.value = false
}

/**
 * Login
 */
 async function startLogin () {
  if (!email.value) {
    $q.notify({message: 'Please enter an email'})
    return
  }
  hasSentEmail.value = false
  isWaitingForOTP.value = true

  await nextTick()

  setTimeout(async () => {
    const resp = await fetch(`${store.db.cloud.options.databaseUrl}/token`, {
      body: JSON.stringify({
        email: email.value,
        grant_type: 'otp',
        scopes: ['ACCESS_DB']
      }),
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    })
    otpData.value = await resp.json()

    hasSentEmail.value = true
    isWaitingForOTP.value = false
    hasManuallyLoggedIn.value = true
    $q.notify({message: 'Email sent'})

    nextTick(() => {
      $otpToken.value.focus()
    })
  })
}

/**
 * Skip login and go to otp
 */
function skipToOTP () {
  hasSentEmail.value = true
  isWaitingForOTP.value = false
}

/**
 * Login with OTP
 * @see https://github.com/dexie/Dexie.js/blob/552005de4f89cf0eb61c8195ae116cb1fd724919/addons/dexie-cloud/src/authentication/otpFetchTokenCallback.ts#LL89C7-L98C8
 */
async function loginWithOTP () {
  const resp = await fetch(`${store.db.cloud.options.databaseUrl}/token`, {
    body: JSON.stringify({
      email: email.value,
      otp: otpToken.value,
      otp_id: otpData.value.otp_id,
      grant_type: 'otp',
      scopes: ['ACCESS_DB']
    }),
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  })

  // Failed
  if (resp.status !== 200) {
    $q.notify({message: 'Invalid token', color: 'negative'})
    return
  }

  // Success
  const accessToken = await resp.json()

  // Login with access token
  store.db.cloud.options.fetchTokens = () => accessToken
  await store.db.cloud.login({email: email.value, grant_type: 'otp'})
  hideModal()
}
</script>
