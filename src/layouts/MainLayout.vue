<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon='menu' aria-label='Menu' @click='toggleMainSidebar')
      q-toolbar-title
        | TensorBuddy
      div Quasar v{{ $q.version }}
  q-drawer(v-model='leftDrawerOpen' show-if-above bordered)
    q-list
      q-item-label(header)
        | Essential Links
      EssentialLink(v-for='link in essentialLinks' :key='link.title' v-bind='link')
  q-page-container
    router-view
</template>

<script setup>
import EssentialLink from 'components/EssentialLink.vue'
const essentialLinks = [
  {
    title: 'System',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
]

/**
 * Toggle sidebar
 */
let leftDrawerOpen = $ref(false)
function toggleMainSidebar () {
  leftDrawerOpen = !leftDrawerOpen
}
</script>
