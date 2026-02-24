import { createContext} from 'react';
import type { WebSocketInstance } from '../types/websocketTypes';
import type {LoginDataContextType, SelectedMemberContextType} from '../types/useContextTypes';

export const WebSocketContext = createContext<WebSocketInstance | null>(null);
export const LoginDataContext = createContext<LoginDataContextType | undefined>(undefined);
export const SelectedMemberContext = createContext<SelectedMemberContextType | null>(null);
