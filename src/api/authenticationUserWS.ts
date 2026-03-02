import { useState, useCallback } from 'react';
import type { 
  WebSocketInstance, 
  UserLoginResponse, 
  UserLogoutResponse,
  WebSocketMessage 
} from '../types/websocketTypes';
import { generateRequestId } from '../utils/generateRequestId';
import { isServerError } from '../types/errorsType';

const isLoginResponse = (
  message: WebSocketMessage,
  requestId: string
): message is UserLoginResponse => {
  return message.type === 'USER_LOGIN' && message.id === requestId;
};

const isLogoutResponse = (
  message: WebSocketMessage,
  requestId: string
): message is UserLogoutResponse => {
  return message.type === 'USER_LOGOUT' && message.id === requestId;
};

export const useAuth = (ws: WebSocketInstance) => {
  const [errorAuthUser, setErrorAuthUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (loginValue: string, password: string): Promise<boolean> => {
      setLoading(true);
      setErrorAuthUser(null);

      try {
        const requestId = generateRequestId();

        const response = await new Promise<UserLoginResponse>((resolve, reject) => {
          const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
            if (isLoginResponse(message, requestId)) {
              unsubscribe();
              resolve(message);
            } else if (isServerError(message, requestId)) {
              unsubscribe();
              reject(new Error(message.payload.error));
            }
          });

          ws.sendMessage({
            id: requestId,
            type: 'USER_LOGIN',
            payload: { user: { login: loginValue, password } },
          });
        });

        if (response.payload?.user) return true;
        throw new Error('Сервер вернул неверный ответ');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setErrorAuthUser(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [ws]
  );


  const logout = useCallback(
    async (loginValue: string, password: string): Promise<boolean> => {
      setLoading(true);
      setErrorAuthUser(null);

      try {
        const requestId = generateRequestId();

        const response = await new Promise<UserLogoutResponse>((resolve, reject) => {
          const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
            if (isLogoutResponse(message, requestId)) {
              unsubscribe();
              resolve(message);
            } else if (isServerError(message, requestId)) {
              unsubscribe();
              reject(new Error(message.payload.error));
            }
          });

          ws.sendMessage({
            id: requestId,
            type: 'USER_LOGOUT',
            payload: { user: { login: loginValue, password } },
          });
        });

        if (response.payload?.user) return true;
        throw new Error('Сервер вернул неверный ответ');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setErrorAuthUser(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [ws]
  );

  return { login, logout, errorAuthUser, loading };
};