import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthInitializer = () => {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {

    const checkAuth = async () => {
      const token = localStorage.getItem('user_auth_token');
      const login = localStorage.getItem('user_login');
      
      if (token && login) {
        setRedirectPath('/dashboard');
          } else {
            localStorage.removeItem('user_auth_token');
            localStorage.removeItem('user_login');
            setRedirectPath(null);
          }
    };
    
    checkAuth();
  }, []);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

    return <div>Проверка авторизации...</div>;
};
