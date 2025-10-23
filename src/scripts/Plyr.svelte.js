import Plyr from 'plyr'

export const player = $state({
  current: null,
  nowPlaying: 'dQw4w9WgXcQ',
  playlist: [
    {
      title: 'Never Gonna Give You Up',
      artist: 'Taylor Swift',
      album: 'Lover',
      videoId: 'dQw4w9WgXcQ',
    },
  ],
})

export const initiatePlyr = async (node) => {
  player.current = new Plyr(node, {
    controls: [],
  })

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
}

export const play = async () => {
  if (player.current) {
    player.current.play()
  }
}

export const stop = async () => {
  if (player.current) {
    player.current.stop()

    player.playlist.shift()
    updatePlyr(player.playlist[0]?.videoId || '')
  }
}

export const pause = async () => {
  if (player.current) {
    player.current.pause()
  }
}
