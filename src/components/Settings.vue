<template lang="pug">
q-btn.full-width.q-pl-sm.q-pr-none(color='light' icon='settings' @click='showModal()')
  q-dialog.fullscreen(v-model='isDialogVisible')
    q-card.flex.column
      q-card-section.flex-unset
        .text-h6 Settings
      q-card-section.flex-auto.align-stretch.q-pb-none

      q-card-actions.flex-unset(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(@click='updateSettings') Update Settings
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'

const isDialogVisible = ref(false)
const $router = useRouter()

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
function updateSettings () {
  console.log('updateSettings')
}
</script>
