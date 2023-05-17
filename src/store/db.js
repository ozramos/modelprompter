import Dexie from 'dexie'
import dexieCloud from 'dexie-cloud-addon'
import FileSaver from 'file-saver'
import SystemPrompt from '/system-prompt.txt?raw'

class Store {
  constructor () {
    this.setup()
  }

  /**
   * Setup
   */
  async setup () {
    this.db = await new Dexie('chat', {addons: [dexieCloud]})

    // Versions need to be upgraded by 2 to account for online/offline
    if (process.env.DEXIE_DB_URL) {
      storeConfig.realms = '@realmId'
      // Next: 5
      store.db.version(3).stores(storeConfig)
    } else {
      // Next: 4
      store.db.version(2).stores(storeConfig)
    }

    if (process.env.DEXIE_DB_URL) {
      this.db.cloud.configure({
        databaseUrl: process.env.DEXIE_DB_URL,
        customLoginGui: true,
      })
    }
  }

  /**
   * Handler for errors
   */
  error (e) {
    console.error(e)
  }

  /**
   * Get all messages
   * - If there are none, a system prompt is returned
   */
  async getMessagesWithSystemPrompt (id = 'chnSystem') {
    let messages = []
    messages = await this.db.messages.where('channel').equals(id).toArray()
      .catch(this.error)

    // Add default system prompt on first load
    // @fixme this looks like the wrong place for this
    if (!id && !messages.length) {
      messages = [await this.createMessage()]
    } else if (!messages.length) {
      // Get the channels system prompt
      const channel = await this.db.channels.get(id)
      if (channel?.prompt) {
        messages = [await this.createMessage({ channel: id, text: channel.prompt })]
      } else {
        messages = [await this.createMessage()]
      }
    }

    return messages
  }

  /**
   * Get all messages for all channels
   */
  async getAllMessagesWithSystemPrompt () {
    let messages = []
    messages = await this.db.messages.toArray()
      .catch(this.error)

    // Add default system prompt on first load
    // @fixme this looks like the wrong place for this
    if (!messages.length) {
      messages = [await this.createMessage()]
    }

    return messages
  }

  /**
   * Get all channels
   */
  async getChannelsWithSystemPrompt () {
    let channels = [{
      "id": "chnSystem",
      "name": "System",
      "prompt": "Welcome! I'm ModelPrompter, a friendly chatbot here to help. Ask me anything!",
      "created": "2023-05-17T05:08:40.643Z",
      "updated": "2023-05-17T05:17:51.066Z",
      "chatModeDisabled": false
    }]
    channels.push(...await this.db.channels.toArray().catch(this.error))

    return channels
  }

  /**
   * Get Channels
   */
  async getChannels () {
    return await this.db.channels.toArray()
      .catch(this.error)
  }

  /**
   * Creates message
   * @return created message
   */
  async createMessage (message = {}) {
    message.name = message.name || 'System'
    message.channel = message.channel || 0
    message.created = message.date || new Date()
    message.updated = message.updated || new Date()
    message.text = message.text || SystemPrompt
    message.sent = message.sent || false
    const messageID = await this.db.messages.add(message)
      .catch(this.error)
    return await this.db.messages.get(messageID)
      .catch(this.error)
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
      .catch(this.error)
    return await this.db.channels.get(channelID)
      .catch(this.error)
  }

  /**
   * Update Channel
   */
  async updateChannel (channel = {}) {
    channel.name = channel.name || 'Untitled'
    channel.prompt = channel.prompt || SystemPrompt
    channel.updated = channel.updated || new Date()

    await this.db.channels.update(channel.id, channel)
      .catch(this.error)
    return await this.db.channels.get(channel.id)
      .catch(this.error)
  }

  /**
   * Delete channel
   */
  async deleteChannel (id) {
    await this.db.channels.delete(id)
     .catch(this.error)
  }

  /**
   * Get settings as an object
   */
  async getSettings () {
    const settings = await this.db.settings.toArray()
      .catch(this.error)

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
          .catch(this.error)
      } else {
        await this.db.settings.add({ key, value: settings[key] })
          .catch(this.error)
      }
    }
  }


  /**
   * Export database
   */
  async exportDatabase () {
    // Export all tables to json
    const json = {
      messages: await this.getAllMessagesWithSystemPrompt(),
      channels: await this.getChannelsWithSystemPrompt(),
      settings: await this.db.settings.toArray().catch(this.error),
    }
    // turn json to file blob
    const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'})
    // turn blob to file
    const data = new File([blob], 'prompter.json', {type: 'application/json'})
    // save file
    const date = new Date().toISOString().split('T')
    FileSaver.saveAs(data, `${date[0]}.prompter.json`)
  }

  /**
   * Import database
   */
  async importDatabase (jsonFile, $q) {
    // Convert file to json
    const json = JSON.parse(await jsonFile.text())

    // Import all settings
    const settings = await this.db.settings.toArray()
    await this.db.settings.bulkPut(json.settings).catch(this.error)

    // Import channels individually, creating as needed
    for (const channel of json.channels) {
      const existingChannel = await this.db.channels.get(channel.id)
      if (existingChannel) {
        await this.db.channels.update(channel.id, channel).catch(this.error)
      } else {
        await this.db.channels.add(channel).catch(this.error)
      }
    }

    // Merge in tables
    for (const message of json.messages) {
      const existingMessage = await this.db.messages.get(message.id)
      if (existingMessage) {
        await this.db.messages.update(message.id, message).catch(this.error)
      } else {
        await this.db.messages.add(message).catch(this.error)
      }
    }

    if (process.env.DEXIE_DB_URL) {
      this.db.cloud.sync()
    }
  }

  /**
   * Delete database
   */
  async deleteDatabase () {
    // Delete each message individually
    const messages = await this.db.messages.toArray()
    for (const message of messages) {
      await this.db.messages.delete(message.id).catch(this.error)
    }

    // Delete each channel individually
    const channels = await this.db.channels.toArray()
    for (const channel of channels) {
      await this.db.channels.delete(channel.id).catch(this.error)
    }

    // Delete each setting individually
    const settings = await this.db.settings.toArray()
    for (const setting of settings) {
      await this.db.settings.delete(setting.id).catch(this.error)
    }

    if (process.env.DEXIE_DB_URL) {
      this.db.cloud.sync()
    }
  }

  /**
   * Is logged in
   */
  async isLoggedIn () {
    return this.db.cloud.currentUserId != 'unauthorized'
  }
}
const store = new Store()





// Configure store after export
export default store
const storeConfig = {
  channels: '@id, name',
  messages: '@id, channel, timestamp, from, to, message',
  settings: '@id, key, value',
}


