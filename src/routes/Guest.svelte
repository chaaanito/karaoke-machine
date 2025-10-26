<script>
  import { onMount } from 'svelte'
  import { initiateGuestPeer, peer } from '../scripts/Peer.svelte'
  import Queue from './components/Queue.svelte'

  const { params } = $props()
  onMount(() => {
    initiateGuestPeer(params.id)
  })
</script>

<div class="max-w-md mx-auto mt-[2%]">
  <h1 class="font-bold text-3xl text-right">Karaoke Machine</h1>
  <div class="tabs tabs-lift">
    <input type="radio" name="my_tabs_3" class="tab" aria-label="Queue" checked="checked" />
    <div class="tab-content bg-base-100 border-base-300 p-6">
      <Queue songs={peer.songs} />
    </div>

    <input type="radio" name="my_tabs_3" class="tab" aria-label="Song Book" />
    <div class="tab-content bg-base-100 border-base-300 p-6">Song Book</div>
  </div>
</div>
