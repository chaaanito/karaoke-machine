<script>
  import Router from 'svelte-spa-router'
  import { Toaster } from 'svelte-sonner'
  import wrap from 'svelte-spa-router/wrap'
  import Player from './routes/Player.svelte'
  import Guest from './routes/Guest.svelte'

  // const routes = {
  //   '/': wrap({
  //     asyncComponent: () => import('./routes/Player.svelte'),
  //   }),
  //   '/:id': wrap({
  //     asyncComponent: () => import('./routes/Guest.svelte'),
  //   }),
  //   '*': wrap({
  //     asyncComponent: () => import('./routes/Player.svelte'),
  //   }),
  // }

  const routes = {
    '/': Player,
    '/:id': Guest,
    '*': Player,
  }
</script>

<Router {routes} />
<Toaster position="bottom-right" expand={false} richColors />
