import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import { WebSocketProvider } from './useContext/WebSocketProvider';
import { LoginDataProvider } from './useContext/LoginCurrentUserProvider';
import { AuthInitializer } from './businessLogic/authInitializer';
import { LoginPage } from './pages/loginPage';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WebSocketProvider>
        <LoginDataProvider>
          <AuthInitializer />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />

        
            </Routes>
        </LoginDataProvider>
      </WebSocketProvider>
    </BrowserRouter>
  </StrictMode>
);
