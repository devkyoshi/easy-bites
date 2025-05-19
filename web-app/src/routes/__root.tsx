import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner.tsx'
import { NavigationProgress } from '@/components/navigation-progress.tsx'
import GeneralError from '@/features/errors/general-error.tsx'
import NotFoundError from '@/features/errors/not-found-error.tsx'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={50000} />
        {import.meta.env.MODE === 'development' && (
          <>
            {/*<ReactQueryDevtools buttonPosition='bottom-left' />*/}
            {/*<TanStackRouterDevtools position='bottom-right' />*/}
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
