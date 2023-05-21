<template lang="pug">
// Create a full height q-page, with a footer for the chat input
// The chat area above it should fill the rest of the page
q-page.boxed(:style-fn='() => ({ height: "calc(100vh - 50px)" })')
  div.column(style='height: 100%;')
    // Chat area
    .full-width.col.q-pa-md(ref='$messages' style='overflow: auto')
      div(v-for='message in messages')
        q-chat-message(
          :key='message.id'
          :text-html='true'
          :text='[formattedMessage[message.id]]'
          :bg-color='getChatBg(message)'
          :text-color='message.sent ? "white" : "black"'
          :stamp='formatDate(message.created || message.updated)'
          :sent='message.name === "System"'
        )
        q-menu(touch-position context-menu auto-close @show='ev => ev.preventDefault() && ev.stopPropagation()')
          q-btn(rel='edit' flat icon='edit' aria-label='Edit' @click='ev => showEditMessage(ev, message)')
          q-btn(rel='delete' flat round icon='delete' aria-label='Delete' @click='ev => deleteMessage(ev, message)')

      q-chat-message(
        v-if='isThinking'
        bg-color='negative'
      )
        q-spinner-dots(size='2rem')

    .full-width.col.q-pa-md(v-if="isEditingMessage" style='overflow: auto')
      MonacoEditor(
        theme="vs-dark"
        ref='$monacoEditor'
        :options="monacoOptions"
        v-model:value="newMessageText"
        @editorDidMount="editorDidMount"
      )

    // Input field with submit button at bottom of view
    .q-pa-md.flex.full-width
      q-fab.q-mr-sm.notext(square direction='up' :color='!isChatModeDisabled ? "cyan" : "dark"' icon='settings' persistent)
        q-fab-action(color='negative' icon='delete' @click='clear' label='Clear messages' external-label)
        q-fab-action(v-if='!isChatModeDisabled' color='blue' icon='group' @click='toggleChat(true)' external-label label='Chat mode enabled')
        q-fab-action(v-else color='dark' icon='group_off' @click='toggleChat(false)' external-label label='Chat mode disabled')
        q-fab-action(v-if='channel?.realmId === "rlm-public"' color='negative' icon='public_off' @click='unpublishChannel' label='Unpublish Channel' external-label)
        q-fab-action(v-else color='green' icon='publish' @click='publishChannel' label='Publish Channel' external-label)

      q-input.flex-auto(v-if='!isEditingMessage' ref='$input' v-model='input' type='textarea' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
      q-btn(flat v-if='isEditingMessage' color='negative' @click='isEditingMessage = false') Cancel
      q-space(v-if='isEditingMessage')
      q-btn(v-if='isEditingMessage' @click='updateMessage') Update
      q-btn.q-ml-sm(v-if='!isEditingMessage' color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted, watch, computed, nextTick} from 'vue'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import store from '/src/store/db.js'
import llm from '/src/langchain/openai.js'
import { useRouter, useRoute } from 'vue-router'
import {useQuasar} from 'quasar'
import md from '/src/boot/markdown.js'
import DOMPurify from 'dompurify'
import MonacoEditor from 'monaco-editor-vue3'

const $q = useQuasar()
const $messages = ref(null)
const messageBeingEdited = ref(true)
const monacoOptions = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  automaticLayout: true,
  minimap: {enabled: false}
}

/**
 * Handle messages
 */
let isThinking = ref(false)
const messages = useObservable(liveQuery(async () => {
  return await store.getMessagesWithSystemPrompt(getChannelID())
}))

watch(messages, () => {
  setTimeout(() => {maybeScrollToBottom(true)}, 0)
})

/**
 * Maybe scroll to bottom
 */
let lastScrollTop = 0
function maybeScrollToBottom (force = false) {
  setTimeout(() => {
    if ($messages.value.scrollTop > lastScrollTop - 200) {
      $messages.value.scrollTop = $messages.value.scrollHeight
    }
    lastScrollTop = $messages.value.scrollTop
  }, 0)
}

/**
 * Reload messages on router change
 */
const $router = useRouter()
const $route = useRoute()
const channel = useObservable(liveQuery(async () => {
  return store.channels.get(getChannelID())
}))

watch(() => $route.params.id, async (newId = 'chnSystem') => {
  messages.value = await store.getMessagesWithSystemPrompt(newId)
  channel.value = await store.db.channels.get(getChannelID())
  isChatModeDisabled.value = !!channel.value?.chatModeDisabled
})
onMounted(async () => {
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
  channel.value = await store.db.channels.get(getChannelID())
  isChatModeDisabled.value = !!channel?.chatModeDisabled

  // Redirect to main channel if channel doesn't exist
  if (getChannelID() !== 'chnSystem' && !messages.value.length) {
    $router.push({name: 'system'})
  }
})


/**
 * Format date to YYYY-MM-DD HH:MM
 */
function formatDate (date) {
  try {
    date = new Date(date)
  } catch (e) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Computed channel ID (when route changes)
function getChannelID () {
  return $router.currentRoute.value.params.id || 'chnSystem'
}

/**
 * Submit a message
 */
const input = ref('')
const isChatModeDisabled = ref(true)
async function submit (ev) {
  // Submit if not holding down CTRL or SHIFT
  if (!ev.ctrlKey && !ev.shiftKey) {
    // Create the message
    // Remove last newline
    input.value = input.value.replace(/\n$/, '')
    const message = await store.createMessage({
      name: 'User',
      text: input.value,
      channel: getChannelID(),
      sent: true
    })
    console.log(input.value)

    // Add message to chat
    messages.value.push(message)
    input.value = ''
    $input.value.focus()

    maybeScrollToBottom()

    // If chat mode is on, send message to AI
    if (!isChatModeDisabled.value) {
      // Transform messages to OpenAI format
      isThinking.value = true
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
}

/**
 * Clears the chat
 */
async function clear () {
  await store.db.messages.where('channel').equals(getChannelID()).delete()
  input.value = ''
  $input.value.focus()
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
  $q.notify('Messages cleared')
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

/**
 * Disable chat mode
 */
async function toggleChat (disabled = false) {
  // Update chat mode in database
  await store.db.channels.update(getChannelID(), {
    chatModeDisabled: disabled
  }).then(() => {
    isChatModeDisabled.value = disabled
  })

  if (!disabled) {
    $q.notify('Chat mode enabled')
  } else {
    $q.notify('Chat mode disabled')
  }
}

/**
 * Apply markdown
 */
const formattedMessage = computed((message) => {
  return messages.value.reduce((msg, item) => {
    // msg[item.id] = DOMPurify.sanitize(md.render(item.text), { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] })
    msg[item.id] = md.render(item.text)

    // Extract naked script tag and run it
    const script = msg[item.id].match(/<script>([\s\S]*)<\/script>/)
    if (script) {
      nextTick(() => {
        const scriptEl = document.createElement('script')
        scriptEl.innerHTML = script[1]
        document.body.appendChild(scriptEl)
      })
    }

    // Do same for modules
    const scriptModule = msg[item.id].match(/<script type="module">([\s\S]*)<\/script>/)
    if (scriptModule) {
      nextTick(() => {
        const scriptEl = document.createElement('script')
        scriptEl.type = 'module'
        scriptEl.innerHTML = scriptModule[1]
        document.body.appendChild(scriptEl)
      })
    }

    // Manually load script tags with src
    const scriptSrc = msg[item.id].match(/<script src="(.*)"><\/script>/)
    if (scriptSrc) {
      nextTick(() => {
        const scriptEl = document.createElement('script')
        scriptEl.src = scriptSrc[1]
        document.body.appendChild(scriptEl)
      })
    }

    return msg
  }, {})
})

/**
 * Publish channel
 */
async function publishChannel () {
  channel.value = await store.publishChannel(getChannelID())
}
async function unpublishChannel () {
  channel.value = await store.unpublishChannel(getChannelID())
}

/**
 * Setup editor
 */
function editorDidMount (editor) {
  globalThis.mp.editor = editor
}

/**
 * Edit message
 */
const $monacoEditor = ref(null)
async function showEditMessage (ev, message) {
  newMessageText.value = message.text
  messageBeingEdited.value = message
  isEditingMessage.value = true

  // Focus input
  await nextTick()
  setTimeout(() => {
    $monacoEditor.value.editor.focus()
  }, 10)
}

/**
 * Update message
 */
const newMessageText = ref('')
const isEditingMessage = ref(false)

async function updateMessage () {
  await store.db.messages.update(messageBeingEdited.value.id, {
    text: newMessageText.value
  })
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
  messageBeingEdited.value = null
  isEditingMessage.value = false
}

/**
 * Delete message
 */
async function deleteMessage (ev, message) {
  await store.db.messages.delete(message.id)
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
}
</script>
