<script>
  import Router from 'svelte-spa-router'
  import { Toaster } from 'svelte-sonner'
  import wrap from 'svelte-spa-router/wrap'

  const routes = {
    '/': wrap({
      asyncComponent: () => import('./routes/Player.svelte'),
    }),
    '/:id': wrap({
      asyncComponent: () => import('./routes/Guest.svelte'),
    }),
    '*': wrap({
      asyncComponent: () => import('./routes/Player.svelte'),
    }),
  }
</script>

<Router {routes} />
<Toaster position="bottom-right" expand={false} richColors />
