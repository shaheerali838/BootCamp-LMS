import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </StrictMode>
=======
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
>>>>>>> origin/Frontend/mustafa-kamal
)
