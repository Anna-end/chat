import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWSData } from '../hooks/useWSData';
import { useAuth } from '../api/authenticationUserWS';
import { useLoginData } from '../useContextHook/loginContext';

export function AuthInitializer() {
  const [isChecking, setIsChecking] = useState(true);

  const navigate = useNavigate();
  const ws = useWSData();
  const { login } = useAuth(ws);
  const { setData } = useLoginData();

  useEffect(() => {
    const tryAutoLogin = async () => {
      const savedLogin = localStorage.getItem('user_login');
      const savedPassword = localStorage.getItem('user_auth_token');
      if (!savedLogin || !savedPassword) {
        console.log('ℹ️ Нет сохранённых данных');
        navigate('/login');
        setIsChecking(false);
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
          localStorage.removeItem('savedLogin');
          localStorage.removeItem('savedPassword');
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
  }, [ws.isConnected]);

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
