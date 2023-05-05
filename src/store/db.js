import Dexie from 'dexie'
import SystemPrompt from '/system-prompt.txt?raw'

class Store {
  constructor () {
    this.db = new Dexie('chat')
    this.hasClearedWaiting = false
  }

  /**
   * Get all messages
   * - If there are none, a system prompt is returned
   */
  async getMessagesWithSystemPrompt (messages = []) {
    if (!messages?.length) {
      messages = await this.db.messages.toArray()
    }
  
    // Add default system prompt if no messages
    if (!messages.length) {
      messages = await this.db.messages.add({
        name: 'System',
        text: SystemPrompt
      })
    }

    // Remove any that are .waiting
    if (!this.hasClearedWaiting) {
      await this.db.messages.filter(message => message.waiting).delete()
      this.hasClearedWaiting = true
    } 
  
    return messages
  }
}
const store = new Store()

/**
 * Export db
 */
export default store
store.db.version(1).stores({
  servers: '++id, name',
  channels: '++id, server, name',
  messages: '++id, channel, timestamp, from, to, message',
  users: '++id, timestamp, first, last, bio, photo, channels'
})