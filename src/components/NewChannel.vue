<template lang="pug">
q-btn.full-width.q-pl-sm(type='a' icon='chat' @click='showModal') New Channel
  q-dialog.fullscreen(v-model='isDialogVisible')
    q-card.flex.column
      q-card-section.flex-unset
        .text-h6 New Channel
      q-card-section.q-pb-none
        p
          q-input(v-model='channelName' label='Channel name' outlined)
        div <strong>Context:</strong> Describe how this server should channel and the agents within it should behave.
      q-card-section.flex-auto.align-stretch
        q-input.full-height.flex-auto(v-model='prompt' label='Prompt' outlined type='textarea')
      q-card-actions.flex-unset(align='right')
        q-btn(flat @click='hideModal') Cancel
        q-space
        q-btn(@click='createChannel') Create channel
</template>
  


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const isDialogVisible = ref(false)
const channelName = ref('Untitled')
const prompt = ref('')
import store from '/src/store/db.js'

const $router = useRouter()

/**
 * Shows the modal and clears the file
 */
function showModal () {
  isDialogVisible.value = true
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

  // Add the prime directive
  const message = await store.createMessage({
    name: 'System',
    channel: channel.id,
    text: prompt.value,
  })

  // Navigate to the channel
  hideModal()
  $router.push({ name: 'channel', params: { id: channel.id } })
}
</script>