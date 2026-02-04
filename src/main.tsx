import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthenticationPage } from './ui/authenticationPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthenticationPage />
  </StrictMode>,
)
