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
import {b64encode} from 'dreambase-library/dist/common/base64'

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
const user = useObservable(liveQuery(() => store.db.cloud.currentUser) || {})
watch(user, () => {
  isLoggedIn.value = store.db.cloud.currentUserId && store.db.cloud.currentUserId !== 'unauthorized'

  if (hasManuallyLoggedIn.value && isLoggedIn.value) {
    $q.notify({message: 'Logged in'})
  }
})
onMounted(() => {
  isLoggedIn.value = store.db.cloud.currentUserId && store.db.cloud.currentUserId !== 'unauthorized'
})

/**
 * Logout
 */
async function logout () {
  await store.db.$logins.clear()
  $q.notify({message: 'Logged out'})
  window.indexedDB.databases().then((r) => {
    for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name)
  })
  window.location.reload()
  hideModal()
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
  }, 0)
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
 * @todo This is hideous and needs refactoring
 * @see https://github.com/dexie/Dexie.js/blob/552005de4f89cf0eb61c8195ae116cb1fd724919/addons/dexie-cloud/src/authentication/otpFetchTokenCallback.ts#LL89C7-L98C8
 */
async function loginWithOTP () {
  const spkiToPEM = function (keydata) {
    const keydataB64 = b64encode(keydata);
    const keydataB64Pem = formatAsPem(keydataB64);
    return keydataB64Pem;
  }
  function formatAsPem(str) {
    let finalString = '-----BEGIN PUBLIC KEY-----\n';
    while (str.length > 0) {
      finalString += str.substring(0, 64) + '\n';
      str = str.substring(64);
    }
    finalString = finalString + '-----END PUBLIC KEY-----';
    return finalString;
  }

  // Get public_key
  // @see https://github.com/dexie/Dexie.js/blob/552005de4f89cf0eb61c8195ae116cb1fd724919/addons/dexie-cloud/src/authentication/authenticate.ts#L2
  if (!crypto.subtle) {
    if (typeof location !== 'undefined' && location.protocol === 'http:') {
      throw new Error(`Dexie Cloud Addon needs to use WebCrypto, but your browser has disabled it due to being served from an insecure location. Please serve it from https or http://localhost:<port> (See https://stackoverflow.com/questions/46670556/how-to-enable-crypto-subtle-for-unsecure-origins-in-chrome/46671627#46671627)`);
    } else {
      throw new Error(`This browser does not support WebCrypto.`);
    }
  }
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    },
    false, // Non-exportable...
    ['sign', 'verify']
  )
  if (!privateKey || !publicKey)
    throw new Error(`Could not generate RSA keypair`) // Typings suggest these can be undefined...
  store.db.cloud.currentUser.nonExportablePrivateKey = privateKey //...but storable!
  const publicKeySPKI = await crypto.subtle.exportKey('spki', publicKey)
  const publicKeyPEM = spkiToPEM(publicKeySPKI)
  store.db.cloud.currentUser.publicKey = publicKey

  // Send OTP
  const isDemo = email.value === 'public@demo.local'

  const resp = await fetch(`${store.db.cloud.options.databaseUrl}/token`, {
    body: JSON.stringify({
      email: email.value,
      otp: otpToken.value,
      demo_user: isDemo ? 'public@demo.local' : undefined,
      otp_id: otpData.value.otp_id,
      grant_type: isDemo ? 'demo' : 'otp',
      public_key: publicKeyPEM,
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
  $router.push('/')
}
</script>
