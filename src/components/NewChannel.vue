<template lang="pug">
q-btn.full-width.q-pl-sm(type='a' icon='chat' @click='showModal') New Channel
  q-dialog.fullscreen(v-model='isDialogVisible')
    q-card.flex.column
      q-card-section.flex-unset
        .text-h6 New Channel
      q-card-section
        p
          q-input(v-model='channelName' label='Channel name' outlined)
        div <strong>Context:</strong> Describe how this server should channel and the agents within it should behave.
      q-card-section.flex-auto.align-stretch
        q-input.full-height.flex-auto(v-model='prompt' label='Prompt' outlined type='textarea')
      q-card-actions.flex-unset(align='right')
        q-btn(flat @click='isDialogVisible = false') Cancel
        q-space
        q-btn(@click='createChannel') Create channel
</template>
  


<script setup>
import { ref, watch } from 'vue'
const isDialogVisible = ref(false)
const channelName = ref('Untitled')
const prompt = ref('')

/**
 * Shows the modal and clears the file
 */
function showModal () {
  isDialogVisible.value = true
}

/**
 * Create a new channel
 */
function createChannel () {
  console.log('createChannel')
}
</script>