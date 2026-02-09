import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import { AuthenticationPage } from './ui/authenticationUi/authenticationPage';
import { DashboardPage } from './ui/dashboardPage';
import { PrivateRoute } from './appRoute/privateRoute'
import { AuthInitializer } from './ui/authenticationUi/authInitializer';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
        <AuthInitializer />
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
