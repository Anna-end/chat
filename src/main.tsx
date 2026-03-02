import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './index.css'
import { LoginDataProvider } from './useContext/LoginCurrentUserProvider';
import { AuthInitializer } from './businessLogic/authInitializer';
import { LoginPage } from './pages/loginPage';
import { MainChatPage } from './pages/MainChatPage';
import { WebSocketProvider} from './useContext/WebSocketProvider';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { SelectedMemberProvider} from './useContext/SelectedMemberContext';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}> 
     <BrowserRouter>
     <WebSocketProvider>
       <SelectedMemberProvider>
   
     
      
       
         
           <LoginDataProvider>
          
            <AuthInitializer />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/dashboard" element={<MainChatPage />} />
              </Routes>
           
            </LoginDataProvider>
     
          
        
      
    
    </SelectedMemberProvider>  
    </WebSocketProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
