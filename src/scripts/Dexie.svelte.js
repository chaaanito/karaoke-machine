import Dexie from 'dexie'

export const db = new Dexie('KaraokeMachineDB')

db.version(1).stores({
  songs: `++id, title , cover , videoId, metadata`,
})
