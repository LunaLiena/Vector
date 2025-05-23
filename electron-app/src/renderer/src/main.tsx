import './assets/main.css';
import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client'
import App from './App';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import { ThemeProvider } from '@gravity-ui/uikit';
import { setUpInterceptors } from '@api/interceptors';
import { ToasterProvider,Toaster } from '@gravity-ui/uikit';
import { createRoot } from 'react-dom/client';
setUpInterceptors();

const toaster = new Toaster();

const rootElement = document.getElementById('root');

if (rootElement){
  const root = createRoot(rootElement);

  root.render(   
    <StrictMode>
      <ToasterProvider toaster={toaster}>
        <ThemeProvider theme='dark' >
          <App />
        </ThemeProvider>
      </ToasterProvider>
    </StrictMode>
  );
}