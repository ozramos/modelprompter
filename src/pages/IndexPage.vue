<template lang="pug">
// Create a full height q-page, with a footer for the chat input
// The chat area above it should fill the rest of the page
q-page(:style-fn='() => ({ height: "calc(100vh - 50px)" })')
  div.column(style='height: 100%;')
    // Chat area
    .col.q-pa-md(style='overflow: auto')
      q-chat-message(
        v-for='message in messages'
        :key='message.text'
        :text='[message.text]'
        :bg-color='message.sent ? "blue" : "primary"'
        :text-color='message.sent ? "white" : "black"'
      )
      q-chat-message(
        v-if='isThinking'
        bg-color='negative'
      )
        q-spinner-dots(size='2rem')
    
    // Input field with submit button at bottom of view
    .col-auto.q-pa-md
      q-input(ref='$input' v-model='input' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
        template(v-slot:prepend)
          q-btn.q-mr-sm(color='negative' label='Clear chat' @click='clear')
        template(v-slot:append)
          q-btn.q-ml-sm(color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted, nextTick} from 'vue'
import {liveQuery} from 'dexie'
import {useObservable} from '@vueuse/rxjs'
import store from '/src/store/db.js'
import llm from '/src/langchain/openai.js'

/**
 * Handle messages
 */
let isThinking = ref(false)
const messages = ref(useObservable(liveQuery(async () => {
  return await store.getMessagesWithSystemPrompt()
})))


/**
 * Submit a message
 */
const input = ref('')
async function submit (ev) {
  // Submit if not holding down CTRL or SHIFT
  if (!ev.ctrlKey && !ev.shiftKey) {
    // Remove last enter character
    input.value = input.value.replace(/\n/g, '')
    const message = {
      name: 'User',
      text: input.value,
      sent: true
    }
    
    // Add message to chat
    input.value = ''
    $input.value.focus()
    isThinking.value = true
    messages.value.push(message)
    await store.db.messages.add(message)

    // Transform messages to OpenAI format
    const transformedMessages = llm.transformMessages(messages.value)
    const response = await llm.call(transformedMessages)

    // Add response to chat
    response.name = message.name
    response.sent = false
    await store.db.messages.add(response)
    isThinking.value = false
  }
}

/**
 * Clears the chat
 */
async function clear () {
  await store.db.messages.clear()
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
