// Adds common classes to a helper object for easy access
import store from '/src/store/db.js'
import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  globalThis.tensorbuddy = await {
    store
  }
})