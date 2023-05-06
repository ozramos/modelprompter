import Dexie from 'dexie'
import SystemPrompt from '/system-prompt.txt?raw'

class Store {
  constructor () {
    this.db = new Dexie('chat')
  }

  /**
   * Get all messages
   * - If there are none, a system prompt is returned
   */
  async getMessagesWithSystemPrompt (id = 0) {
    let messages = []
    messages = await this.db.messages.where('channel').equals(id).toArray()
    
    // Add default system prompt if no messages
    if (!id && !messages.length) {
      await this.db.messages.add({
        name: 'System',
        channel: 0,
        date: new Date(),
        text: SystemPrompt,
      })
    }

    return messages
  }

  /**
   * Get Channels
   */
  async getChannels () {
    return await this.db.channels.toArray()
  }
}
const store = new Store()

/**
 * Export db
 */
export default store
store.db.version(1).stores({
  channels: '++id, name',
  messages: '++id, channel, timestamp, from, to, message',
  users: '++id, timestamp, first, last, bio, photo, channels'
})