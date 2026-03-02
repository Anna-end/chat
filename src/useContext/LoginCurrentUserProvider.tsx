import { useState } from 'react';
import type { ReactNode } from 'react';
import type {UserData, LoginDataContextType} from '../types/useContextTypes'
import { LoginDataContext } from './Contexts'
interface LoginDataProviderProps {
  children: ReactNode;
}

export function LoginDataProvider({ children }: LoginDataProviderProps) {
  const [userData, setUserData] = useState<UserData>({
    login: '',
  });

  const setData = (updates: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const clearData = () => {
    setUserData({ login: ''});
  };

  const value: LoginDataContextType = {
    userData,
    setData,
    clearData,
  };

  return <LoginDataContext.Provider value={value}>{children}</LoginDataContext.Provider>;
}