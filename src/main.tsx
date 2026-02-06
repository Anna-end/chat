import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import { AuthenticationPage } from './ui/authenticationPage';
import { DashboardPage } from './ui/dashboardPage';
import { PrivateRoute } from './appRoute/privateRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
        <Routes>
           <Route path="/" element={<Navigate to="/login" />} />

           <Route path="/login" element={<AuthenticationPage />} />

          <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        </Routes>
     </BrowserRouter>
  </StrictMode>,
)
