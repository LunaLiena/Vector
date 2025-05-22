import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import { RouterProvider } from '@tanstack/react-router';
import { router } from '@renderer/routes/router';
import { useAuthStore } from '@store/authStore';
import { useUserStore } from '@store/userStore';


function App() {
  const { isAuth, } = useAuthStore();
  const { user } = useUserStore();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuth,
          role: user?.role,
        }
      }}
    />
  );
}

export default App;