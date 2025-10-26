import Plyr from 'plyr'
import { db } from './Dexie.svelte'

export const player = $state({
  current: null,
  nowPlaying: 'dQw4w9WgXcQ',
  playlist: [
    {
      title: 'Never Gonna Give You Up',
      videoId: 'dQw4w9WgXcQ',
    },
  ],
})

export const initiatePlyr = async (node) => {
  player.current = new Plyr(node, {
    controls: [],
  })

  player.playlist = await db.songs.toArray()

  if (player.playlist[0]?.videoId) {
    player.nowPlaying = player.playlist[0]?.videoId
  }

  await updatePlyr(player.nowPlaying)
}

export const updatePlyr = async (videoId) => {
  player.current.source = {
    type: 'video',
    sources: [
      {
        src: videoId,
        provider: 'youtube',
      },
    ],
  }

  player.current.once('ready', () => {
    player.current.play()
  })
}

export const play = async () => {
  if (player.current) {
    player.current.play()
  }
}

export const stop = async () => {
  if (player.current) {
    player.current.stop()

    if (player.playlist[0]?.videoId) {
      //update plyr instance
      updatePlyr(player.playlist[0]?.videoId || '')
    }

    // Delete the first item in the "items" table
    const firstItem = await db.songs.orderBy('id').first()
    if (firstItem) {
      await db.songs.delete(firstItem.id)
      player.playlist = await db.songs.toArray()
    } else {
      console.log('No items to delete')
    }
  }
}

export const pause = async () => {
  if (player.current) {
    player.current.pause()
  }
}
