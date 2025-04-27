//src/routeTree.gen.ts
import { redirect, createRoute } from '@tanstack/react-router';
import { LoginForm } from '@components/LoginForm';
import { AdminDashboard } from '@components/roles/AdminDashboard';
import { CommanderDashboard } from '@components/roles/CommanderDashboard';
import { GroundDashboard } from '@components/roles/GroundDashboard';
import { EngineerDashboard } from '@components/roles/EngineerDashboard';
import { AstronautDashboard } from '@components/roles/AstronautDashboard';
import { RootRoute } from './__root';
import type { MyRouterContext } from '@renderer/types/router';

const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: LoginForm,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuth && context.auth.role?.name) {
      console.log('context.auth.isAuth (from LoginRoute):', context.auth.isAuth)
      throw redirect({ to: getRouteByRole(context.auth.role?.name), replace: true });
    }
  }
});

const AdminRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/admin',
  component: AdminDashboard,
  beforeLoad: ({ context }: { context: MyRouterContext }) => {
    if (!context.auth.isAuth || context.auth.role?.name !== 'Центр Управления Полётами') {
      throw redirect({ to: '/' });
    }
  }
})

const CommanderRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/commander',
  component: CommanderDashboard,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuth || context.auth.role?.name !== 'Командир Экипажа') {
      throw redirect({ to: '/' });
    }
  },
});

const EngineerRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/engineer',
  component: EngineerDashboard,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuth || context.auth.role?.name !== 'Бортовой Инженер') {
      throw redirect({ to: '/' });
    }
  },
});

const AstronautRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/astronaut',
  component: AstronautDashboard,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuth || context.auth.role?.name !== 'Космонавт') {
      throw redirect({ to: '/' });
    }
  },
});

const GroundRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/ground',
  component: GroundDashboard,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuth || context.auth.role?.name !== 'Наземный Персонал') {
      throw redirect({ to: '/' });
    }
  },
});

const getRouteByRole = (role?: string) => {

  if (!role) return '/';

  switch (role) {
    case 'Центр Управления Полётами': return '/admin';
    case 'Командир Экипажа': return '/commander';
    case 'Бортовой Инженер': return '/engineer';
    case 'Космонавт': return '/astronaut';
    case 'Наземный Персонал': return '/ground';
    default: return '/';
  }
};




export const routeTree = RootRoute.addChildren([
  LoginRoute,
  AdminRoute,
  CommanderRoute,
  EngineerRoute,
  AstronautRoute,
  GroundRoute,
]);