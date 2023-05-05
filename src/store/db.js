import {boot} from 'quasar/wrappers'
import Dexie from 'dexie'

const db = new Dexie('chat')
export default db

db.version(1).stores({
  servers: '++id, name',
  channels: '++id, server, name',
  messages: '++id, channel, timestamp, from, to, message',
  users: '++id, timestamp, first, last, bio, photo, channels'
})