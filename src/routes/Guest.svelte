<script>
  import { onMount } from 'svelte'
  import { initiateGuestPeer, peer } from '../scripts/Peer.svelte'
  import Queue from './components/Queue.svelte'

  const { params } = $props()
  onMount(() => {
    loadingModal.showModal()
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

    <input type="radio" name="my_tabs_3" class="tab" aria-label="Songbook" />
    <div class="tab-content bg-base-100 border-base-300 p-6">Songbook</div>
  </div>
</div>

<dialog id="loadingModal" class="modal">
  <div class="modal-box">
    <div class="text-center">
      <h3 class="text-lg font-bold">Connecting to Host Machine...</h3>
      <br />
      <span class="loading loading-ring loading-xl"></span>
    </div>
  </div>
</dialog>
