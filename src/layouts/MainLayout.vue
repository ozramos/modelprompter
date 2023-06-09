<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header
    q-toolbar
      q-btn(flat dense round icon='menu' aria-label='Menu' @click='toggleMainSidebar')
      q-toolbar-title
        router-link.text-decoration-none.text-white(to='/')
          img.lt-md.q-mr-sm(:src='$env.logo?.small || "/logo-title-small.png"' height=32 style='vertical-align: middle')
          img.gt-sm.q-mr-sm(:src='$env.logo?.title || "/logo-title.png"' height=32 style='vertical-align: middle')
        a(:href='$env.logo?.release || "https://github.com/ozramos/modelprompter/releases"' target='_blank')
          small.q-ml-sm(style='font-size: .65em; display: inline-block; transform: translate(0, -3px)') {{pkg.version}}
      q-space(style='flex-grow: 0 !important')
      LoginLogout
    q-space

  q-drawer.flex-drawer.full-height.width-inherit(v-model='isMainSidebarOpen' show-if-above bordered)
    q-list
      q-item-label(header)
        | Channels

    //- Links
    q-list(style='overflow-y: auto; overflow-x: hidden;')
      QDraggableTree.q-draggable-tree(v-model='sidebarTree' :data='sidebarTree' rowkey='id')
        template(#body='{item}')
          q-item.channel-menu-item(:key='item.id' v-bind='item.channel' clickable :to='{ name: "channel", params: { id: item.id } }')
            q-item-section(avatar)
              q-icon(v-if='item.channel.id === "chnSystem"' name='hive')
              q-icon(v-else :name='item.channel.realmId === "rlm-public" ? "public" : "chat"')
            q-item-section
              q-item-label(lines=1) {{ item.channel.name }}
              q-item-label(v-if='item.channel.caption' caption) {{ item.channel.caption }}
            q-item-section
              q-btn(rel='edit' flat dense icon='edit' aria-label='Edit' @click='ev => editChannel(ev, item.channel)')
              q-btn(rel='edit' flat dense icon='content_copy' aria-label='Copy' @click='ev => copyChannel(ev, item.channel)')
              q-btn(v-if='item.channel.id !== "chnSystem"' rel='delete' flat dense icon='delete' aria-label='Delete' @click='ev => deleteChannel(ev, item.channel)')
            q-menu(touch-position context-menu @show='ev => ev.preventDefault() && ev.stopPropagation()')
              q-btn.q-pl-sm(rel='edit' flat round icon='edit' aria-label='Edit' @click='ev => editChannel(ev, item.channel)')
              q-btn(rel='edit' flat round icon='content_copy' aria-label='Copy' @click='ev => copyChannel(ev, item.channel)')
              q-btn(rel='delete' flat round icon='delete' aria-label='Delete' @click='ev => deleteChannel(ev, item.channel)')

    //- Add channel button at bottom of list
    q-space
    q-list.q-pb-sm(dense)
      q-item
        div.q-pr-sm
          Settings
        NewChannel(ref='$newChannel')
  q-page-container
    router-view
</template>

<script setup>
import {ref, watch} from 'vue'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import pkg from '/package.json'
import store from '/src/store/db.js'
import NewChannel from '/src/components/NewChannel.vue'
import Settings from '/src/components/Settings.vue'
import LoginLogout from '/src/components/LoginLogout.vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import {debounce} from 'quasar'

const connectedToCloud = !!process.env.DEXIE_DB_URL
const allowLogin = !!Number(process.env.ALLOW_LOGIN)
const $env = ref(globalThis.mp.env)

const $q = useQuasar()
const $router = useRouter()
const channels = useObservable(liveQuery(async () => await getChannels()))

/**
 * Get channels
 */
async function getChannels () {
  const channels = await store.getChannels()

  // Move id: chnSystem to the beginning
  const systemChannel = channels.find(c => c.id === 'chnSystem')
  if (systemChannel) {
    channels.splice(channels.indexOf(systemChannel), 1)
    channels.unshift(systemChannel)
  }

  // Update Sidebar tree
  let tree = channels.map(c => ({
    id: c.id,
    label: c.name,
    channel: c,
    children: [],
  }))
  tree = [{
    id: 0,
    label: 'Channels',
    channel: {},
    children: tree
  }]
  sidebarTree.value = tree

  return channels
}

/**
 * Poll for new channels
 */
// @todo let's pick a more optimal interval
setInterval(async () => {
  channels.value = await getChannels()
}, 1000)

/**
 * Update sort property on channels
 */
const sidebarTree = ref([])
const updateSort = debounce((newTree) => {
  const tree = newTree[0].children
  let channels = tree.map(c => c.channel)

  // Move system to front
  const systemChannel = channels.find(c => c.id === 'chnSystem')
  if (systemChannel) {
    channels.splice(channels.indexOf(systemChannel), 1)
    channels.unshift(systemChannel)
  }

  // Update sort property
  channels = channels.map((c, i) => {
    c.sort = i
    return c
  })

  store.updateSorts(channels)
}, 500, {leading: false, trailing: true})
watch(sidebarTree, updateSort, {deep: true})

/**
 * Toggle sidebar
 */
const isMainSidebarOpen = ref(false)
function toggleMainSidebar () {
  isMainSidebarOpen.value = !isMainSidebarOpen.value
}

/**
 * Edit channel
 */
const $newChannel = ref(null)
function editChannel (ev, channel) {
  $newChannel.value.showModal(channel)
  ev.preventDefault()
  ev.stopPropagation()
  return false
}

/**
 * Delete channel
 */
async function deleteChannel (ev, channel) {
  await store.deleteChannel(channel.id)

  await store.createMessage({
    name: 'System',
    channel: 'chnSystem',
    text: `<strong>Channel deleted</strong>: ${channel.name}`,
  })

  $q.notify({
    message: `Deleted channel ${channel.name}`,
  })

  ev.preventDefault()
  ev.stopPropagation()

  $router.push('/')
  return false
}

/**
 * Copy channel
 */
async function copyChannel (ev, channel) {
  // Clone the channel but assign the realmId to user
  let newChannel = Object.assign({}, channel, {
    name: `${channel.name} (copy)`,
    realmId: getPosterRealm(channel)
  })
  delete newChannel.id

  // Create the channel
  const newChan = await store.createChannel(newChannel)

  // Copy messages to new channel
  const messages = await store.getMessagesWithSystemPrompt(channel.id)
  messages.forEach(async m => {
    m = Object.assign({}, m)
    delete m.id
    const message = await store.createMessage({
      ...m,
      channel: newChan.id,
      realmId: newChan.realmId
    })
    await store.updateMessage(message.id, {
      created: m.created,
    }, true)
  })

  // Notify
  $q.notify({
    message: `Copied channel ${channel.name}`,
  })

  ev.preventDefault()
  ev.stopPropagation()

  $router.push({ name: 'channel', params: { id: newChan.id } })
  return false
}

// Computed channel realm
function getPosterRealm (channel) {
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
</script>
