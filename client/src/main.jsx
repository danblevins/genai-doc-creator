import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/material-theme.css'
import './index.css'
// Material Web (M3) – register custom elements
import '@material/web/fab/fab.js'
import '@material/web/icon/icon.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/button/text-button.js'
import '@material/web/radio/radio.js'
import '@material/web/labs/card/outlined-card.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
