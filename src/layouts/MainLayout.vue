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
          small.q-ml-sm(style='font-size: .65em; display: inline-block; transform: translate(0, -3px)') {{$pkg.version}}
  q-drawer.flex.column(v-model='isMainSidebarOpen' show-if-above bordered)
    q-list.flex.column.full-height
      q-item-label(header)
        | Channels

      //- System channel
      q-item(clickable to='/')
        q-item-section(avatar)
          q-icon(name='hive')
        q-item-section
          q-item-label System
      
      //- Links
      q-item(v-for='channel in channels' :key='channel.id' v-bind='channel' clickable :to='{ name: "channel", params: { id: channel.id } }')
        q-item-section(avatar)
          q-icon(v-if='channel.icon' :name='channel.icon')
          q-icon(v-else name='chat')
        q-item-section
          q-item-label {{ channel.name }}
          q-item-label(v-if='channel.caption' caption) {{ channel.caption }}
      
      //- Add channel button at bottom of list
      q-space
      q-list.q-pb-sm(dense)
        q-item
          NewChannel
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

const $pkg = pkg
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
</script>
