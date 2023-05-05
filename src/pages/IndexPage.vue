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
        template(v-slot:prepend)
            q-btn.q-mr-sm(color='negative' label='Clear chat' @click='clear')
        template(v-slot:append)
          q-btn.q-ml-sm(color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted} from 'vue'
import {liveQuery} from 'dexie'
import {useObservable} from '@vueuse/rxjs'
import {db, getMessagesWithSystemPrompt} from '/src/store/db.js'

/**
 * Handle messages
 */
const messages = ref(useObservable(liveQuery(async () => {
  return await getMessagesWithSystemPrompt()
})))


/**
 * Submit a message
 */
const input = ref('')
async function submit (ev) {
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
    await db.messages.add(message)
    
    // Clear and focus input
    input.value = ''
    $input.value.focus()
  }
}

/**
 * Clears the chat
 */
async function clear () {
  await db.messages.clear()
  input.value = ''
  $input.value.focus()
}

/**
 * Focus input on mount
 */
const $input = ref(null)
onMounted(() => {
  $input.value.focus()
})
</script>
