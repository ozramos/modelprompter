<template lang="pug">
q-btn.full-width.q-pl-sm(icon='chat' @click='showModal()') New Channel
  q-dialog.fullscreen(v-model='isDialogVisible')
    q-card.flex.column
      q-card-section.flex-unset
        .text-h4(v-if='isEditing') Edit Channel
        .text-h4(v-else) New Channel
      q-card-section.q-pb-none
        p
          q-input(v-model='channelName' label='Channel name' outlined)
        div Describe how this server should channel and the agents within it should behave.
      q-card-section.flex-auto.align-stretch
        q-input.full-height.flex-auto(v-model='prompt' label='Prompt' outlined type='textarea')
      q-card-actions.flex-unset(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(v-if='isEditing' @click='updateChannel') Update channel
        q-btn(v-else @click='createChannel') Create channel
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '/src/store/db.js'
import {useQuasar} from 'quasar'

const isDialogVisible = ref(false)
const channelName = ref('Untitled')
const prompt = ref('')
const $q = useQuasar()

const $router = useRouter()
let isEditing = ref(false)
const channelID = ref(null)

/**
 * Shows the modal and clears the message
 * @channel {Channel} The channel to edit or null to create a new one
 */
function showModal (channel = {}) {
  isDialogVisible.value = true
  isEditing.value = !!channel.id || false
  channelID.value = channel.id || null

  if (channel.id) {
    channelName.value = channel.name
    prompt.value = channel.prompt
  } else {
    channelName.value = 'Untitled'
    prompt.value = ''
  }
}

function hideModal () {
  isDialogVisible.value = false
}

/**
 * Create a new channel
 */
async function createChannel () {
  // Create the channel
  const channel = await store.createChannel({
    name: channelName.value,
    prompt: prompt.value,
  })

  // Update system message
  const message = await store.createMessage({
    name: 'System',
    channel: 'chnSystem',
    text: `<p><strong>Channel created</strong>: ${channel.name}<p><strong>With prompt:</strong><pre>${channel.prompt}</pre>`,
  })

  // Navigate to the channel
  hideModal()
  $q.notify({message: `Channel created`})
  $router.push({ name: 'channel', params: { id: channel.id } })
}

/**
 * Update a channel
 */
async function updateChannel () {
  // Update the channel
  const channel = await store.updateChannel({
    id: channelID.value,
    name: channelName.value,
    prompt: prompt.value,
  })

  await store.createMessage({
    name: 'System',
    channel: 'chnSystem',
    text: `<p><strong>Channel updated</strong>: ${channel.name}<p><strong>With prompt:</strong><pre>${channel.prompt}</pre>`,
  })

  // Navigate to the channel
  hideModal()
  $q.notify({message: `Channel updated`})
  $router.push({ name: 'channel', params: { id: channel.id } })
}

/**
 * Defines
 */
defineExpose({showModal})
</script>
