<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header
    q-toolbar
      q-btn(flat dense round icon='menu' aria-label='Menu' @click='toggleMainSidebar')
      q-toolbar-title
        router-link.text-decoration-none.text-white(to='/')
          img.lt-md.q-mr-sm(src='/logo-title-small.png' height=32 style='vertical-align: middle')
          img.gt-sm.q-mr-sm(src='/logo-title.png' height=32 style='vertical-align: middle')
        a(href='https://github.com/modelprompter/modelprompter/releases' target='_blank')
          small.q-ml-sm(style='font-size: .65em; display: inline-block; transform: translate(0, -3px)') {{pkg.version}}
      q-space(style='flex-grow: 0 !important')
      LoginLogout
    q-space

  q-drawer.flex-drawer.full-height.width-inherit(v-model='isMainSidebarOpen' show-if-above bordered)
    q-list
      q-item-label(header)
        | Channels

      //- System channel
      q-item(clickable to='/')
        q-item-section(avatar)
          q-icon(name='hive')
        q-item-section
          q-item-label System

    //- Links
    q-list(style='overflow-y: auto; overflow-x: hidden;')
      q-item.channel-menu-item(v-for='channel in channels' :key='channel.id' v-bind='channel' clickable :to='{ name: "channel", params: { id: channel.id } }')
        q-item-section(avatar)
          q-icon(v-if='channel.icon' :name='channel.icon')
          q-icon(v-else name='chat')
        q-item-section
          q-item-label(lines=1) {{ channel.name }}
          q-item-label(v-if='channel.caption' caption) {{ channel.caption }}
        q-item-section
          q-btn(rel='edit' flat dense icon='edit' aria-label='Edit' @click='ev => editChannel(ev, channel)')
          q-btn(rel='delete' flat dense icon='delete' aria-label='Delete' @click='ev => deleteChannel(ev, channel)')
        q-menu(touch-position context-menu @show='ev => ev.preventDefault() && ev.stopPropagation()')
          q-btn(rel='edit' flat icon='edit' aria-label='Edit' @click='ev => editChannel(ev, channel)')
          q-btn(rel='delete' flat round icon='delete' aria-label='Delete' @click='ev => deleteChannel(ev, channel)')

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
import {ref} from 'vue'
import {useObservable} from '@vueuse/rxjs'
import {liveQuery} from 'dexie'
import pkg from '/package.json'
import store from '/src/store/db.js'
import NewChannel from '/src/components/NewChannel.vue'
import Settings from '/src/components/Settings.vue'
import LoginLogout from '/src/components/LoginLogout.vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

const $q = useQuasar()
const $router = useRouter()
const channels = ref(useObservable(liveQuery(async () => {
  return await store.getChannels()
})))

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
  $q.notify({
    message: `Deleted channel ${channel.name}`,
  })

  ev.preventDefault()
  ev.stopPropagation()

  $router.push('/')
  return false
}
</script>
