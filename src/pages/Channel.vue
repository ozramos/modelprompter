<template lang="pug">
// Create a full height q-page, with a footer for the chat input
// The chat area above it should fill the rest of the page
div.scripts-container(ref='$scriptsContainer')
q-page.boxed(:style-fn='() => ({ height: "calc(100vh - 50px)" })')
  div.column(style='height: 100%;')
    // Chat area
    q-splitter.col(v-model='splitter' :disable='!isEditingMessage' ref='$messages' horizontal style='overflow: auto')
      template(v-slot:before)
        .q-pa-md
          div(v-for='message in messages')
            q-chat-message(
              :key='message.id'
              :text-html='true'
              :text='[formattedMessage[message.id]]'
              :bg-color='getChatBg(message)'
              :text-color='getChatTextColor(message)'
              :stamp='formatDate(message.created || message.updated)'
              :sent='message.name === "System"'
              :data-id='message.id'
            )
            q-menu(touch-position context-menu auto-close @show='ev => ev.preventDefault() && ev.stopPropagation()')
              q-btn(rel='edit' flat icon='edit' aria-label='Edit' @click='ev => showEditMessage(ev, message)')
              q-btn(rel='delete' flat round icon='delete' aria-label='Delete' @click='ev => deleteMessage(ev, message)')
              q-btn(rel='redo' flat icon='replay' aria-label='Redo' @click='ev => redoLLM(ev, message)')

          q-chat-message(
            v-if='isThinking'
            bg-color='negative'
          )
            q-spinner-dots(size='2rem')

      template(v-if='isEditingMessage' v-slot:after)
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
        q-fab-action(v-if='!isChatModeDisabled' color='teal' text-color='light' icon='group' @click='toggleChat(true)' external-label label='Chat mode enabled')
        q-fab-action(v-else color='dark' icon='group_off' @click='toggleChat(false)' external-label label='Chat mode disabled')
        q-fab-action(v-if='channel?.realmId === "rlm-public"' color='negative' icon='public_off' @click='unpublishChannel' label='Unpublish Channel' external-label)
        q-fab-action(v-else color='green' icon='publish' @click='publishChannel' label='Publish Channel' external-label)
        q-fab-action(v-if='!channel?.readFromTop' color='dark' icon='keyboard_double_arrow_up' @click="readFromTop" label='Reading from bottom' external-label)
        q-fab-action(v-else color='dark' icon='keyboard_double_arrow_down' @click="readFromBottom" label='Reading from top' external-label)

      q-input.flex-auto(v-if='!isEditingMessage' ref='$input' v-model='input' type='textarea' @keyup.enter='submit' autogrow dense style="max-height: 350px; overflow: auto")
      q-btn(flat v-if='isEditingMessage' color='negative' @click='isEditingMessage = false') Cancel
      q-space(v-if='isEditingMessage')
      q-btn(v-if='isEditingMessage' @click='updateMessage') Update
      q-btn.q-ml-sm(v-if='!isEditingMessage' color='primary' label='Send' @click='submit')
</template>



<script setup>
import {ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import store from '/src/store/db.js'
import llm from '/src/langchain/openai.js'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import {useQuasar, debounce} from 'quasar'
import md from '/src/boot/markdown.js'
import DOMPurify from 'dompurify'
import MonacoEditor from 'monaco-editor-vue3'
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition } = scroll

const $q = useQuasar()
const $messages = ref(null)
const $scriptsContainer = ref(null)
const messageBeingEdited = ref(true)
const monacoOptions = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  wordWrap: 'on',
  automaticLayout: true,
  language: 'markdown',
  minimap: {enabled: false}
}
const splitter = ref(100)
const newMessageText = ref('')
const isEditingMessage = ref(0)
const forcedUpdates = ref(0)

/**
 * Full height splitter if not editing
 */
watch(splitter, (val) => {
  if (!isEditingMessage.value) {
    splitter.value = 100
  }
})
watch(isEditingMessage, (val) => {
  if (!val) {
    splitter.value = 100
  } else {
    splitter.value = 50
  }
})

/**
 * Useful for garbage cleaning (eg Layers.p5)
 */
onBeforeRouteLeave((to, from) => {
  // Trigger custom event for hooks
  const event = new CustomEvent('beforeRouteLeave', {
    detail: {
      to,
      from
    }
  })
})


/**
 * Handle messages
 */
let isThinking = ref(false)
const messages = useObservable(liveQuery(async () => {
  const messages = await store.getMessagesWithSystemPrompt(getChannelID())
  // Stort by date
  return messages.sort((a, b) => {
    return a.created - b.created
  })
}))

watch(messages, () => {
  setTimeout(() => {
    if (channel.value?.readFromTop) {
      maybeScrollToTop(true)
    } else {
      maybeScrollToBottom(true)
    }
  }, 0)

  // Stort by date
  messages.value = messages.value.sort((a, b) => {
    return a.created - b.created
  })
})

/**
 * Maybe scroll to bottom
 */
let lastScrollTop = 0
function maybeScrollToBottom (force = false) {
  if (channel.readFromTop && !force) return
  setTimeout(() => {
    const $scroll = $messages.value?.$el?.querySelector('.q-splitter__before')
    if ($scroll?.scrollTop > lastScrollTop - 200) {
      $scroll.scrollTop = $scroll.scrollHeight
    }
    lastScrollTop = $messages.value.scrollTop
  }, 50)
}

function maybeScrollToTop (force = false) {
  if (!channel.readFromTop && !force) return
  setTimeout(() => {
    const $scroll = $messages.value?.$el?.querySelector('.q-splitter__before')
    if ($scroll) {
      $scroll.scrollTop = 0
    }
    lastScrollTop = 0
  }, 50)
}

/**
 * Read from top
 */
async function readFromTop () {
  // channel.value = false
  await store.db.channels.update(getChannelID(), {
    readFromTop: true
  })
  maybeScrollToTop(true)
  channel.value.readFromTop = true
}

/**
 * Read from bottom
 */
async function readFromBottom () {
  await store.db.channels.update(getChannelID(), {
    readFromTop: false
  })
  maybeScrollToBottom(true)
  channel.value.readFromTop = false
}

/**
 * Reload messages on router change
 */
const $router = useRouter()
const $route = useRoute()
const channel = useObservable(liveQuery(async () => {
  const ch = await store.db.channels.get(getChannelID())
  setTimeout(() => {
    if (ch?.readFromTop) {
      maybeScrollToTop(true)
    } else {
      maybeScrollToBottom(true)
    }
  }, 50)
  return ch
}))

watch(() => $route.params.id, async (newId = 'chnSystem') => {
  messages.value = await store.getMessagesWithSystemPrompt(newId)
  channel.value = await store.db.channels.get(getChannelID())
  isChatModeDisabled.value = !!channel.value?.chatModeDisabled

  if (channel.value?.readFromTop) {
    maybeScrollToTop(true)
  } else {
    maybeScrollToBottom(true)
  }
  redirectOnEmptyChannel()
})

let pollingInterval = null
onMounted(async () => {
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
  channel.value = await store.db.channels.get(getChannelID())
  isChatModeDisabled.value = !!channel?.chatModeDisabled

  redirectOnEmptyChannel()

  // Poll for new messages
  // @todo let's pick a more optimal interval
  pollingInterval = setInterval(async () => {
    const newMessages = await store.getMessagesWithSystemPrompt(getChannelID())

    // Scan to see if there were any changes
    for (let i = 0; i < newMessages.length; i++) {
      if (newMessages[i]?.text !== messages.value?.[i]?.text) {
        messages.value = newMessages
        break
      }
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})

async function redirectOnEmptyChannel () {
  // Redirect to first available channel if in /
  if ($router.currentRoute.value.name === 'home' || channel.value === undefined) {
    const channels = await store.getChannels()
    if (channels.length) {
      if (channels[0].id === 'chnSystem' && channels.length > 1) {
        $router.push({name: 'channel', params: {id: channels[1].id}})
      } else {
        $router.push({name: 'channel', params: {id: channels[0].id}})
      }
    }
  }
}

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
// Computed channel realm
function getPosterRealm () {
  // If not logged in, or not realm owner, add message to self
  if (!store.db?.cloud?.currentUserId || ['unauthorized'].includes(store.db?.cloud?.currentUserId)) {
    return null
  }

  // Return if specifically rlm-public
  if (channel.value?.realmId === 'rlm-public') {
    return 'rlm-public'
  }

  return store.db.cloud.currentUserId
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
      realmId: getPosterRealm(),
      sent: true
    })

    // Add message to chat
    messages.value.push(message)
    input.value = ''
    $input.value.focus()

    if (channel.value.readFromTop) {
      maybeScrollToTop()
    } else {
      maybeScrollToBottom()
    }

    // If chat mode is on, send message to AI
    if (!isChatModeDisabled.value) {
      // Transform messages to OpenAI format
      isThinking.value = true
      if (process.env.OPENAI_API_KEY) {
        const transformedMessages = llm.transformMessages(messages.value)
        const response = await llm.call(transformedMessages)

        // Add response to chat
        response.name = 'Agent'
        response.sent = false
        response.channel = message.channel
        response.realmId = getPosterRealm()

        process.env.OPENAI_API_KEY && messages.value.push(await store.createMessage(response))
      } else {
        $q.notify({message: 'OpenAI API key not set', color: 'negative'})
      }

      isThinking.value = false
    }
  }
}

/**
 * Redo the message
 */
async function redoLLM (ev, message) {
  // Transform messages to OpenAI format
  isThinking.value = true
  let index = messages.value.findIndex(msg => msg.id === message.id)

  // Only send the messages that were sent before this one (including this one)
  // @fixme change to updated when sorting is implemented
  const messagesToRedo = messages.value.filter(msg => {
    return msg.created <= message.created
  })

  // Remove from messagesToRedo the elemnt with same id
  const backup = Object.assign({}, message)
  if (message.name === "Agent") {
    messagesToRedo.splice(messagesToRedo.findIndex(msg => msg.id === message.id), 1)
    messages.value.splice(messages.value.findIndex(msg => msg.id === message.id), 1)
    forcedUpdates.value++
    await store.db.messages.delete(message.id)
  }

  try {
    if (process.env.OPENAI_API_KEY) {
      const transformedMessages = llm.transformMessages(messagesToRedo)
      const response = await llm.call(transformedMessages)

      // Add response to chat
      response.name = 'Agent'
      response.sent = false
      response.channel = message.channel
      response.updated = message.updated
      response.realmId = getPosterRealm()

      // Add the image near where it was restarted from
      if (message.name === 'User') {
        const msg = await store.createMessage(response)
        msg.created = message.created
        messages.value.splice(index+1, 0, msg)
        await store.db.messages.update(msg.id, {created: message.created, realmId: getPosterRealm()})
      } else {
        const msg = await store.createMessage(response)
        msg.created = message.created
        messages.value.splice(index, 0, msg)
        await store.db.messages.update(msg.id, {created: message.created, realmId: getPosterRealm()})
      }

      setTimeout(() => {
        forcedUpdates.value++
      }, 50)
      forcedUpdates.value++
    } else {
      $q.notify({message: 'OpenAI API key not set', color: 'negative'})
    }
  } catch (e) {
    // Restore message
    if (message.name === "Agent") {
      await store.db.messages.put(backup)
    }
    $q.notify({message: `Error redoing message: ${e}`, color: 'negative'})
    console.log(e)
  }

  isThinking.value = false
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

  if (!isEditingMessage?.value || isEditingMessage?.value !== msg.id) {
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
  } else {
    switch (msg.name) {
      case 'System':
        bg = 'success'
        break
      case 'Agent':
        bg = 'yellow-2'
        break
      case 'User':
        bg = 'teal'
        break
    }
  }

  return bg
}
function getChatTextColor (message) {
  if (!isEditingMessage?.value || isEditingMessage?.value !== message.id) {
    return message.sent ? "white" : "black"
  } else {
    return 'black'
  }
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
  nextTick(() => {
    setTimeout(() => scanAndRunScripts(), 0)
  })

  return messages.value.reduce((msg, item) => {
    msg[item.id] = DOMPurify.sanitize(md.render(item.text), { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] })
    msg[item.id] = md.render(item.text)

    return msg
  }, {})
})

/**
 * Scan and run scripts
 */
const scanAndRunScripts = debounce(() => {
  if (!$messages.value?.$el || !$scriptsContainer.value) return

  // Remove current scripts
  $scriptsContainer.value.innerHTML = ''

  // Extract script tags and run them
  $messages.value.$el.querySelectorAll('script').forEach(script => {
    const scriptEl = document.createElement('script')
    scriptEl.innerHTML = script.innerHTML
    $scriptsContainer.value.appendChild(scriptEl)
  })

  // Wrap <video> tags in a container
  $messages.value.$el.querySelectorAll('video').forEach(video => {
    if (video.parentElement.classList.contains('video-container')) return
    video.outerHTML = `<div class="video-container">${video.outerHTML}<div class="video-container-mask"></div><i class="q-icon notranslate material-icons">play_circle_filled</i></div>`
  })
}, 100)

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
  isEditingMessage.value = message.id

  // Focus input
  await nextTick()
  setTimeout(() => {
    $monacoEditor.value.editor.focus()
  }, 10)

  // Scroll into view
  const $el = document.querySelector(`[data-id="${message.id}"]`)
  if ($el) {
    const target = $el.closest('.q-splitter').querySelector('.q-splitter__before')
    const offset = $el.offsetTop - 4
    const duration = 250
    setVerticalScrollPosition(target, offset, duration)
  }
}

/**
 * Update message
 */
async function updateMessage () {
  await store.db.messages.update(messageBeingEdited.value.id, {
    text: newMessageText.value
  })
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
  messageBeingEdited.value = null
  isEditingMessage.value = 0
}

/**
 * Delete message
 */
async function deleteMessage (ev, message) {
  await store.db.messages.delete(message.id)
  messages.value = await store.getMessagesWithSystemPrompt(getChannelID())
}
</script>
