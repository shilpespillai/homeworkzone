import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AIProvider } from './context/AIContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AIProvider>
      <App />
    </AIProvider>
  </React.StrictMode>,
)
