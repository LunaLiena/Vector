import { createRootRouteWithContext,Outlet } from '@tanstack/react-router';
import type { MyRouterContext } from '@renderer/types/router';

export const RootRoute = createRootRouteWithContext<MyRouterContext>()({
  component:Outlet
});