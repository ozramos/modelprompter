<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'


globalThis.$q = useQuasar()
globalThis.notify = $q.notify
</script>
