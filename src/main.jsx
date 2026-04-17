import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MindProvider } from './context/MindContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MindProvider>
      <App />
    </MindProvider>
  </StrictMode>,
)
