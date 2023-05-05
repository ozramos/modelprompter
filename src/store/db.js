import {boot} from 'quasar/wrappers'
import Dexie from 'dexie'
import SystemPrompt from '/system-prompt.txt?raw'

/**
 * Export db
 */
export const db = new Dexie('chat')
db.version(1).stores({
  servers: '++id, name',
  channels: '++id, server, name',
  messages: '++id, channel, timestamp, from, to, message',
  users: '++id, timestamp, first, last, bio, photo, channels'
})

/**
 * Get all messages
 * - If there are none, a system prompt is returned
 */
export async function getMessagesWithSystemPrompt (messages = []) {
  if (!messages?.length) {
    messages = await db.messages.toArray()
  }

  // Add default system prompt if no messages
  if (!messages.length) {
    messages = await db.messages.add({
      name: 'System',
      text: [SystemPrompt]
    })
  }  

  return messages
}
getMessagesWithSystemPrompt()