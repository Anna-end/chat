import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {WebSocketContext} from './Contexts';
import { useWebSocket } from '../api/configWSConnection';

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const ws = useWebSocket();
  useEffect(() => {
    let cancelled = false;

    ws.connect().catch(error => {
      if (!cancelled) {
        console.error('❌ Ошибка подключения:', error);
      }
    });

    return () => {
      cancelled = true;
      ws.disconnect();
    };
  }, []);
  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
}