import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MindProvider } from './context/MindContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MindProvider>
        <App />
      </MindProvider>
    </BrowserRouter>
  </StrictMode>,
)
