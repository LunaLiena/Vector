import { createRootRouteWithContext,Outlet } from '@tanstack/react-router';
import type { MyRouterContext } from '@renderer/types/router';

export const RootRoute = createRootRouteWithContext<MyRouterContext>()({
  component:Outlet,
  errorComponent:({error})=>(
    <div className="p-4 bg-red-100 text-red-800 rounded-lg">
      <h1>Critical Error</h1>
      <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
    </div>
  ),
});