import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@renderer/routes/routeTree.gen';

// Функция безопасного получения роли из localStorage
const getInitialRole = () => {
  const roleJson = localStorage.getItem('role');
  return roleJson ? JSON.parse(roleJson) : null;
};

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: {
      isAuth: !!localStorage.getItem('accessToken'),
      role: getInitialRole(),
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}