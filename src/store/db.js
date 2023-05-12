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
      messages = [await this.createMessage()]
    } else if (!messages.length) {
      // Get the channels system prompt
      const channel = await this.db.channels.get(id)
      messages = [await this.createMessage({ channel: id, text: channel.prompt })]
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
    message.channel = Number(message.channel || 0)
    message.created = message.date || new Date()
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
    channel.chatModeDisabled = false

    const channelID = await this.db.channels.add(channel)
    return await this.db.channels.get(channelID)
  }

  /**
   * Update Channel
   */
  async updateChannel (channel = {}) {
    channel.name = channel.name || 'Untitled'
    channel.prompt = channel.prompt || SystemPrompt
    channel.updated = channel.updated || new Date()

    await this.db.channels.update(channel.id, channel)
    return await this.db.channels.get(channel.id)
  }

  /**
   * Delete channel
   */
  async deleteChannel (id) {
    await this.db.channels.delete(id)
  }

  /**
   * Get settings as an object
   */
  async getSettings () {
    const settings = await this.db.settings.toArray()
    const settingsObject = {}
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value
    })
    return settingsObject
  }

  /**
   * Update settings
   */
  async updateSettings (settings = {}) {
    for (const key in settings) {
      const setting = await this.db.settings.get({ key })
      if (setting) {
        await this.db.settings.update(setting.id, { value: settings[key] })
      } else {
        await this.db.settings.add({ key, value: settings[key] })
      }
    }
  }
}
const store = new Store()

/**
 * Export db
 */
export default store
store.db.version(2).stores({
  channels: '++id, name',
  messages: '++id, channel, timestamp, from, to, message',
  settings: '++id, key, value'
})
