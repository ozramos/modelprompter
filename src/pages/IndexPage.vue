<template lang="pug">
// Create a full height q-page, with a footer for the chat input
// The chat area above it should fill the rest of the page
q-page(:style-fn='() => ({ height: "calc(100vh - 50px)" })')
  div.column(style='height: 100%;')
    // Chat area
    .col.q-pa-md(style='overflow: auto')
      q-chat-message(v-for='message in messages' :key='message.text' :name='message.name' :text='message.text' :sent='message.sent' :received='message.sent')
    
    // Input field with submit button at bottom of view
    .col-auto.q-pa-md
      q-input(ref='$input' v-model='input' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
        template(v-slot:append)
          q-btn(color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted} from 'vue'
import {liveQuery} from 'dexie'
import {useObservable} from '@vueuse/rxjs'
import db from '/src/store/db.js'
import SystemPrompt from '/system-prompt.txt?raw'

/**
 * Handle messages
 */
const messages = ref(useObservable(liveQuery(async () => {
  const messages = await db.messages.toArray()
  
  // Add default system prompt if no messages
  if (!messages.length) {
    const message = {
      name: 'System',
      text: [SystemPrompt]
    }
    messages.add(message)
  }

  return messages
})))


/**
 * Submit a message
 */
const input = ref('')
function submit (ev) {
  // Submit if not holding down CTRL
  if (!ev.ctrlKey) {
    // Remove last enter character
    input.value = input.value.replace(/\n/g, '')
    const message = {
      user: 1,
      text: [input.value],
      sent: true
    }
    
    // Add message to chat
    messages.value.push(message)
    db.messages.add(message)
    
    // Clear input
    input.value = ''
  }
}

/**
 * Focus input on mount
 */
const $input = ref(null)
onMounted(() => {
  $input.value.focus()
})
</script>
