import './assets/main.css'
import { StrictMode } from 'react'
import App from './App'
import { swrConfig } from './lib/swrConfig'
import { SWRConfig } from 'swr'
import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css' // Раскомментируйте этот импорт
import { ThemeProvider } from '@gravity-ui/uikit'
import { setUpInterceptors } from '@api/interceptors'
import { ToasterProvider, Toaster } from '@gravity-ui/uikit'
import { createRoot } from 'react-dom/client'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

setUpInterceptors()

export const toaster = new Toaster()

const rootElement = document.getElementById('root')
ModuleRegistry.registerModules([AllCommunityModule])

if (rootElement) {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <ToasterProvider toaster={toaster}>
        <ThemeProvider theme="dark">
          <SWRConfig value={swrConfig}>
            <App />
          </SWRConfig>
        </ThemeProvider>
      </ToasterProvider>
    </StrictMode>
  )
}
