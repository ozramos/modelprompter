import {boot} from 'quasar/wrappers'
import Dexie from 'dexie'
import SystemPrompt from '/system-prompt.txt?raw'

/**
 * Export db
 */
const db = new Dexie('chat')
export default db
db.version(1).stores({
  servers: '++id, name',
  channels: '++id, server, name',
  messages: '++id, channel, timestamp, from, to, message',
  users: '++id, timestamp, first, last, bio, photo, channels'
})

/**
 * Initialize for the first time
 */
async function init () {
  const messages = await db.messages.toArray()

  // Add default system prompt if no messages
  if (!messages.length) {
    db.messages.add({
      name: 'System',
      text: [SystemPrompt]
    })
  }  
}
init()