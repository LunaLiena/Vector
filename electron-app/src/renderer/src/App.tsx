import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';


import { RouterProvider } from '@tanstack/react-router';
import { router } from '@renderer/routes/router';
import { useAuthStore } from '@store/authStore';


function App() {
  const { isAuth, user} = useAuthStore();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuth,
          role: user?.role || null,
        }
      }}
    />
  );
}

export default App;