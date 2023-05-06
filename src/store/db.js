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
    
    // Add default system prompt on first load
    // @fixme this looks like the wrong place for this
    if (!id && !messages.length) {
      await this.createMessage()
      messages = await this.db.messages.where('channel').equals(id).toArray()
    }

    return messages
  }

  /**
   * Get Channels
   */
  async getChannels () {
    return await this.db.channels.toArray()
  }

  /**
   * Creates message
   * @return created message
   */
  async createMessage (message = {}) {
    message.name = message.name || 'System'
    message.channel = message.channel || 0
    message.date = message.date || new Date()
    message.updated = message.updated || new Date()
    message.text = message.text || SystemPrompt
    message.sent = message.sent || false
    const messageID = await this.db.messages.add(message)
    return await this.db.messages.get(messageID)
  }

  /**
   * Create Channel
   */
  async createChannel (channel = {}) {
    channel.name = channel.name || 'Untitled'
    channel.prompt = channel.prompt || SystemPrompt
    channel.created = channel.created || new Date()
    channel.updated = channel.updated || new Date()

    return await this.db.channels.add(channel)
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