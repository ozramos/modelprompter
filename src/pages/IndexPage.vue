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
      q-input(v-model='input' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
        template(v-slot:append)
          q-btn(color='primary' label='Send' @click='submit')
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  {
    name: 'System',
    text: [`Welcome! I'm TensorBuddy, a friendly chatbot here to help. Ask me anything!`]
  }
])

/**
 * Submit a message
 */
const input = ref('')
function submit (ev) {
  // Submit if not holding down CTRL
  if (!ev.ctrlKey) {
    // Remove last enter character
    input.value = input.value.replace(/\n/g, '')
    
    // Add message to chat
    messages.value.push({
      text: [input.value],
      sent: true
    })
    // Clear input
    input.value = ''
  }
}
</script>
