import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';


import { RouterProvider } from '@tanstack/react-router';
import { router } from '@renderer/routes/router';
import { useAuthStore } from '@store/authStore';
import { useEffect } from 'react';
import { authService } from './services/authService';


function App() {
  const { isAuth, user} = useAuthStore();

  useEffect(()=>{
    if(isAuth){
      authService.checkAuth().then(isValid=>{
        if(!isValid){
          console.warn('Initial auth check failed');
        }
      });
    }
  },[isAuth]);

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