<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon='menu' aria-label='Menu' @click='toggleMainSidebar')
      q-toolbar-title
        | TensorBuddy
      div v{{ $pkg.version }}
  q-drawer(v-model='isMainSidebarOpen' show-if-above bordered)
    q-list
      q-item-label(header)
        | Servers
      
      // Links
      q-item(v-for='server in servers' :key='server.title' v-bind='server' clickable :to='server.link')
        q-item-section(v-if='server.icon' avatar)
          q-icon(:name='server.icon')
        q-item-section
          q-item-label {{ server.title }}
          q-item-label(caption) {{ server.caption }}
  q-page-container
    router-view
</template>

<script setup>
import {ref} from 'vue'
import pkg from '/package.json'

const $pkg = pkg
const servers = [
  {
    title: 'System',
    // caption: 'Chat with your AI agents',
    icon: 'hive',
    link: '/'
  },
]

/**
 * Toggle sidebar
 */
const isMainSidebarOpen = ref(false)
function toggleMainSidebar () {
  isMainSidebarOpen.value = !isMainSidebarOpen.value
}
</script>
