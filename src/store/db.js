import Dexie from 'dexie'
import dexieCloud from 'dexie-cloud-addon'
import {exportDB, importInto} from 'dexie-export-import'
import FileSaver from 'file-saver'
import SystemPrompt from '/system-prompt.txt?raw'

class Store {
  constructor () {
    this.db = new Dexie('chat', {addons: [dexieCloud]})

    if (process.env.DEXIE_DB_URL) {
      this.db.cloud.configure({
        databaseUrl: process.env.DEXIE_DB_URL
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
  async getMessagesWithSystemPrompt (id = 0) {
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
    const blob = await exportDB(this.db)
      .catch(this.error)
    const date = new Date().toISOString().split('T')
    FileSaver.saveAs(blob, `${date[0]}.modelprompter.json`)
  }

  /**
   * Import database
   */
  async importDatabase (jsonFile, $q) {
    await this.deleteDatabase()
      .catch(this.error)

    importInto(this.db, jsonFile)
      .then(() => {
        $q.notify({message: 'Database imported'})
      })
      .catch(e => {
        $q.notify({message: `Error importing database:\n${e}`, color: 'red'})
      })
  }

  /**
   * Delete database
   */
  async deleteDatabase () {
    await this.db.delete()
      .catch(this.error)

    await this.db.open()
      .catch(this.error)
  }
}
const store = new Store()





// Configure store after export
export default store
const storeConfig = {
  channels: '@id, name',
  messages: '@id, channel, timestamp, from, to, message',
  settings: '@id, key, value'
}

// Versions need to be upgraded by 2 to account for online/offline
if (process.env.DEXIE_DB_URL) {
  storeConfig.realms = '@realmId'
  // Next: 5
  store.db.version(3).stores(storeConfig)
} else {
  // Next: 4
  store.db.version(2).stores(storeConfig)
}


