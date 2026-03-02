import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWSData } from '../hooks/useWSData';
import { useAuth } from '../api/authenticationUserWS';
import { useLoginData } from '../hooks/useLoginCurrentUser';
import { useAppSelector } from '../store/hooks';

const USER_LOGIN_KEY = 'user_login';
const USER_PASSWORD_KEY = 'user_auth_token';

export function AuthInitializer() {
  const [isChecking, setIsChecking] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const ws = useWSData();
  const { login } = useAuth(ws);
  const { setData } = useLoginData();

  const isConnected = useAppSelector(state => state.chat.isConnected);

  useEffect(() => {
    const tryAutoLogin = async () => {
      const savedLogin = localStorage.getItem(USER_LOGIN_KEY);
      const savedPassword = localStorage.getItem(USER_PASSWORD_KEY);

      if (!savedLogin || !savedPassword || location.pathname === '/login') {
        console.log('ℹ️ Нет сохранённых данных');
        setIsChecking(false);
        return;
      }

      if (!isConnected) {
        return; 
      }

      try {
        console.log('🔑 Пробуем войти автоматически...');
        const success = await login(savedLogin, savedPassword);

        if (success) {
          console.log('✅ Автовход успешен!');
          setData({ login: savedLogin });
          navigate('/dashboard');
        } else {
          console.log('❌ Автовход не удался, данные устарели');
          localStorage.removeItem(USER_LOGIN_KEY);
          localStorage.removeItem(USER_PASSWORD_KEY);
          navigate('/login');
        }
      } catch (error) {
        console.error('💥 Ошибка при автовходе:', error);
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };

    tryAutoLogin();
  }, [isConnected]);

  if (!isChecking) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        gap: '16px',
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: '48px' }}>🔄</div>
      <h2 style={{ margin: 0 }}>Проверка авторизации...</h2>
      <p style={{ color: '#666', margin: 0 }}>Пожалуйста, подождите</p>
    </div>
  );
}
