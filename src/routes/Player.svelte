<script>
  import Marquee from 'svelte-fast-marquee'
  import { initiatePlyr, pause, play, player, stop } from '../scripts/Plyr.svelte'
  import { generateQRcode } from '../scripts/QRcode.svelte'
  import { onDestroy } from 'svelte'

  onDestroy(() => player.current?.destroy())
</script>

<div class="font-bold text-2xl fixed top-0 p-5 z-10 w-full">
  <Marquee speed="40" direction="left" pauseOnHover="true">
    {#if player.playlist.length === 0}
      <p class="mr-50">Select Song</p>
      <p class="mr-50">Select Song</p>
      <p class="mr-50">Select Song</p>
      <p class="mr-50">Select Song</p>
      <p class="mr-50">Select Song</p>
    {:else}
      {#each player.playlist as song, index}
        <p class="mr-5">{index + 1}. {song.title}</p>
      {/each}
    {/if}
  </Marquee>
</div>

<div class="max-w-7xl mx-auto mt-15 p-5">
  <div
    id="player"
    class="aspect-auto flex items-center justify-center"
    use:initiatePlyr
    data-plyr-provider="youtube"
    data-plyr-embed-id={player.nowPlaying}
  ></div>
</div>

<div class="w-full flex flex-row justify-between items-center fixed bottom-0 z-10 p-10">
  <div class="flex flex-col items-center">
    <img class="rounded-xl shadow-2xl" use:generateQRcode alt="qr-code" />
    <p>+ add song</p>
  </div>
  <div class="flex flex-col">
    <p class="font-bold {player.playlist[0]?.title ? '' : 'hidden'}">Now</p>
    <p class="font-bold text-2xl">{player.playlist[0]?.title || ''}</p>
  </div>
</div>

<div class="flex flex-row justify-center w-full p-2 fixed bottom-0 z-20 gap-5">
  <button class="btn btn-primary" onclick={play}>Play</button>
  <button class="btn btn-primary" onclick={pause}>Pause</button>
  <button class="btn btn-primary" onclick={stop}>Stop</button>
</div>
