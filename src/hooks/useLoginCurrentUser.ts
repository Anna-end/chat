import type {LoginDataContextType} from '../types/useContextTypes'
import { useContext } from 'react';
import {LoginDataContext} from '../useContext/Contexts'

export function useLoginData(): LoginDataContextType {
  const context = useContext(LoginDataContext);

  if (!context) {
    throw new Error('useLoginData must be used within a LoginDataProvider');
  }

  return context;
}