<script>
  import { onMount } from 'svelte'
  import { db } from '../../scripts/Dexie.svelte'
  import { toast } from 'svelte-sonner'
  import { peer } from '../../scripts/Peer.svelte'

  const { songs } = $props()

  let url = $state()
  let metadata = $state(null)

  const parseYouTubeUrl = (url) => {
    if (!url) return {}

    try {
      const u = new URL(url)
      const videoId = u.searchParams.get('v') || u.pathname.split('/').find((x) => x.length === 11) || null
      const listId = u.searchParams.get('list') || null

      return { videoId, listId }
    } catch {
      return {}
    }
  }

  const findUrl = async () => {
    try {
      if (!url) return

      const { videoId, listId } = parseYouTubeUrl(url)

      if (listId && !videoId) {
        toast.info('This appears to be a playlist, not a single video.')
        metadata = null
        return
      }

      if (!videoId) {
        throw new Error('Invalid YouTube link.')
      }

      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error('This video could not be found or isn’t embeddable.')
      }

      metadata = {
        ...data,
        videoId,
        listId,
      }
    } catch (error) {
      metadata = null

      let message = 'Something went wrong. Please try again.'

      if (error.message.includes('embeddable')) {
        message = 'This video could not be found or isn’t embeddable.'
      } else if (error.message.includes('Invalid YouTube')) {
        message = 'Invalid YouTube link. Please paste a valid URL.'
      } else if (error.message.includes('Failed to fetch')) {
        message = 'Network error. Please check your internet connection.'
      } else if (error.message.includes('Server returned')) {
        message = 'Server error. Please try again later.'
      }

      toast.error(message)
      console.error('❌ NoEmbed error:', error)
    }
  }

  const addSongToQueue = async () => {
    if (peer.connection) {
      peer.connection.send({
        type: 'add',
        song: {
          title: metadata.title,
          cover: metadata.thumbnail_url,
          videoId: metadata.videoId,
          metadata: metadata,
        },
      })
    }
  }
</script>

<ul class="list bg-base-100 rounded-box shadow-md">
  <div class="flex flex-row justify-end">
    <button class="btn btn-xs btn-primary" onclick={() => addSongModal.showModal()}>+ add</button>
  </div>
  <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Song Queue</li>

  {#each songs as song, index}
    <li class="list-row">
      <div class="text-4xl font-thin opacity-30 tabular-nums">{(index + 1).toString().padStart(2, '0')}</div>
      <div><img class="size-10 rounded-box" src={song.cover} alt="song-cover" /></div>
      <div class="list-col-grow">
        <div>Guest</div>
        <div class="text-xs uppercase font-semibold opacity-60">{song.title}</div>
      </div>
    </li>
  {/each}
</ul>

<dialog id="addSongModal" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">Queue Song</h3>
    <div class="w-full flex flex-row justify-between gap-2 items-center">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Youtube URL/Link</legend>
        <textarea class="textarea h-10 w-full" placeholder="Paste Youtube URL" bind:value={url}></textarea>
        <div class="label">Copy and Paste Youtube URL/Link here.</div>
      </fieldset>
      <button class="btn btn-primary" onclick={() => findUrl()}>Find</button>
    </div>
    <br />
    {#if metadata}
      <div class="card card-side bg-base-100 shadow-sm">
        <figure class="max-w-50">
          <img src={metadata.thumbnail_url} alt="song-cover" />
        </figure>
        <div class="card-body flex flex-col justify-between">
          <h2 class="card-title">{metadata.title}</h2>
          <div class="card-actions justify-end">
            <button class="btn btn-sm btn-primary" onclick={() => addSongToQueue()}>+ add</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</dialog>
