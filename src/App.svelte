<script>
  import Router from 'svelte-spa-router'
  import Player from './routes/Player.svelte'
  import Guest from './routes/Guest.svelte'

  const routes = {
    '/': Player,
    '/:id': Guest,
    '*': Player,
  }
</script>

<Router {routes} />
