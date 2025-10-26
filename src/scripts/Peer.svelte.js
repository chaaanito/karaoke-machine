import Peer from 'peerjs'
import { toast } from 'svelte-sonner'
import { db } from './Dexie.svelte'
import { player } from './Plyr.svelte'
import { generateQRcode } from './QRcode.svelte'

export const peer = $state({
  current: null,
  connection: null,
  machineId: localStorage.getItem('hostId') || '',
  guestId: null,
  songs: [],
})

export const initiatePeer = async () => {
  peer.current = new Peer(peer.machineId)

  peer.current.on('open', (id) => {
    console.log(`Machine ID: ${id}`)
    localStorage.setItem('hostId', id)
    generateQRcode(document.getElementById('qr-code'))
  })

  peer.current.on('connection', (conn) => {
    conn.on('data', async (data) => {
      if (data.type === 'message') {
        toast.success(data.message)

        //send connected message
        conn.send({
          type: 'message',
          message: 'Hello from Host Machine!',
        })

        //send song queue list
        let songlist = await db.songs.toArray()
        if (songlist) {
          conn.send({
            type: 'list',
            songs: songlist,
          })
        }
      }

      if (data.type === 'add' && data['song']) {
        // add song to queue
        const id = await db.songs.add({
          title: data.song.title,
          cover: data.song.cover,
          videoId: data.song.videoId,
          metadata: data.song.metadata,
        })
        // add song to songbook
        const songbook = await db.songbook.add({
          title: data.song.title,
          cover: data.song.cover,
          videoId: data.song.videoId,
          metadata: data.song.metadata,
        })

        toast.success(`Song: ${data.song.title} - added to queue!`)

        // send added song confirmation
        conn.send({
          type: 'message',
          message: `Song: ${data.song.title} - added to queue!`,
        })

        let songlist = await db.songs.toArray()
        if (songlist) {
          //update song queue in player
          player.playlist = songlist

          //resend to guest the updated song queue
          conn.send({
            type: 'list',
            songs: songlist,
          })
        }
      }
    })
  })
}

export const initiateGuestPeer = async (hostId) => {
  peer.current = new Peer()

  peer.current.on('open', (id) => {
    peer.guestId = id
    console.log(`My Peer ID: ${peer.guestId}`)

    const conn = peer.current.connect(hostId)
    peer.connection = conn

    conn.on('open', () => {
      //send message that you are connected!
      conn.send({
        type: 'message',
        message: 'Hello from Guest Machine!',
      })
    })

    conn.on('data', (data) => {
      if (data.type === 'message') {
        toast.success(data.message)
        loadingModal.close()
      }

      //receive songs in queue
      if (data.type === 'list' && data['songs']) {
        peer.songs = data.songs
        addSongModal.close()
      }
    })

    return { conn }
  })
}
