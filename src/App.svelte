<script>
  import Router from 'svelte-spa-router'
  import Player from './routes/Player.svelte'
  import Guest from './routes/Guest.svelte'
  import { Toaster } from 'svelte-sonner'

  const routes = {
    '/': Player,
    '/:id': Guest,
    '*': Player,
  }
</script>

<Router {routes} />
<Toaster position="bottom-right" expand={false} richColors />
