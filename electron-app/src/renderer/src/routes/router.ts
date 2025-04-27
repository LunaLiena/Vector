import { createRouter } from "@tanstack/react-router";
import {routeTree} from '@renderer/routes/routeTree.gen';
import type { MyRouterContext } from "@renderer/types/router";

const defaultContext:MyRouterContext = {
  auth:{
    isAuth:false,
    role:undefined,
  },
}

export const router = createRouter({
    routeTree,
    defaultPreload:'intent',
    context:defaultContext,
});

declare module '@tanstack/react-router'{
    interface Register{
        router:typeof router;
    }
}