import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import { WebSocketProvider } from './useContext/WebSocketProvider';
import { LoginDataProvider } from './useContext/LoginCurrentUserProvider';
import { AuthInitializer } from './businessLogic/authInitializer';
import { LoginPage } from './pages/loginPage';
import { SelectedMemberProvider } from './useContext/SelectedMemberContext';
import { MainChatPage } from './pages/MainChatPage';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WebSocketProvider>
        <LoginDataProvider>
          <AuthInitializer />
          <SelectedMemberProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />

              <Route path="/dashboard" element={<MainChatPage />} />
            </Routes>
            </SelectedMemberProvider>
        </LoginDataProvider>
      </WebSocketProvider>
    </BrowserRouter>
  </StrictMode>
);
