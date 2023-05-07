<template lang="pug">
// Create a full height q-page, with a footer for the chat input
// The chat area above it should fill the rest of the page
q-page.boxed(:style-fn='() => ({ height: "calc(100vh - 50px)" })')
  div.column(style='height: 100%;')
    // Chat area
    .col.q-pa-md(style='overflow: auto')
      q-chat-message(
        v-for='message in messages'
        :key='message.text'
        :text='[message.text]'
        :bg-color='getChatBg(message)'
        :text-color='message.sent ? "white" : "black"'
        :stamp='formatDate(message.updated)'
        :sent='message.name === "System"'
      )
      q-chat-message(
        v-if='isThinking'
        bg-color='negative'
      )
        q-spinner-dots(size='2rem')
    
    // Input field with submit button at bottom of view
    .q-pa-md.flex.full-width
      //- q-btn.q-mr-sm(color='secondary' text-color="black" label='Clear chat' @click='clear')
      q-btn.q-mr-sm(color='secondary' text-color="dark" label='setup' @click='clear')
      q-input.flex-auto(ref='$input' v-model='input' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
      q-btn.q-ml-sm(color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted, watch} from 'vue'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import store from '/src/store/db.js'
import llm from '/src/langchain/openai.js'
import { useRouter, useRoute } from 'vue-router'

/**
 * Handle messages
 */
let isThinking = ref(false)
const messages = ref(useObservable(liveQuery(async () => {
  return await store.getMessagesWithSystemPrompt(getChannelID())
})))


/**
 * Reload messages on router change
 */
const $router = useRouter()
const $route = useRoute()
watch(() => $route.params.id, async (newId = 0) => {
  messages.value = await store.getMessagesWithSystemPrompt(Number(newId))
})
onMounted(async () => {
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())

  // Redirect to main channel if channel doesn't exist
  if (getChannelID() && !messages.value.length) {
    $router.push({name: 'system', params: {id: 0}})
  }
})

/**
 * Format date to YYYY-MM-DD HH:MM
 */
function formatDate (date) {
  if (!(date instanceof Date)) {return ''}
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Computed channel ID (when route changes)
function getChannelID () {
  return Number($router.currentRoute.value.params.id || 0)
}

/**
 * Submit a message
 */
const input = ref('')
async function submit (ev) {
  // Submit if not holding down CTRL or SHIFT
  if (!ev.ctrlKey && !ev.shiftKey) {
    // Create the message
    // Remove last newline
    input.value = input.value.replace(/\n/g, '')
    const message = await store.createMessage({
      name: 'User',
      text: input.value,
      channel: getChannelID(),
      sent: true
    })
    messages.value.push(message)
    
    // Add message to chat
    input.value = ''
    $input.value.focus()
    isThinking.value = true

    // Transform messages to OpenAI format
    const transformedMessages = llm.transformMessages(messages.value)
    const response = await llm.call(transformedMessages)

    // Add response to chat
    response.name = 'Agent'
    response.sent = false
    response.channel = message.channel
    messages.value.push(await store.createMessage(response))
    isThinking.value = false
  }
}

/**
 * Clears the chat
 */
async function clear () {
  await store.db.messages.where('channel').equals(getChannelID()).delete()
  input.value = ''
  $input.value.focus()
}

/**
 * Get chat background color
 */
function getChatBg (msg) {
  let bg = 'black'
  switch (msg.name) {
    case 'System':
      bg = 'success'
      break
    case 'Agent':
      bg = 'primary'
      break
    case 'User':
      bg = 'blue'
      break
  }
  return bg
}

/**
 * Focus input on mount
 */
const $input = ref(null)
onMounted(() => {
  $input.value.focus()
})
</script>
