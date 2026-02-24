import { useCallback, useEffect, useState } from 'react';
import type {
  WebSocketInstance,
  WebSocketMessage,
  AuthenticatedUsersResponse,
  UserLogoutServer,
  UserLoginServer,
} from '../types/websocketTypes';
import { useLoginData } from '../hooks/useLoginCurrentUser';

const isLoginResponse = (
  message: WebSocketMessage,
  requestId: string
): message is AuthenticatedUsersResponse => {
  return message.type === 'USER_ACTIVE' && message.id === requestId;
};

const isUserEvent = (message: WebSocketMessage): boolean => {
  return message.type === 'USER_EXTERNAL_LOGOUT' || message.type === 'USER_EXTERNAL_LOGIN';
};

interface User {
  login: string;
  isLogined: boolean;
}
export const useAuthUsers = (ws: WebSocketInstance) => {
  const [authenticatedUsers, setAuthenticatedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useLoginData();

  useEffect(() => {
    if (!ws) return;

    const handleServerEvents = (message: WebSocketMessage) => {
      console.log('📨 Получено сообщение:', message.type);
      if (isUserEvent(message)) {
        const logoutMsg = message as UserLogoutServer;
        const login = message as UserLoginServer;
        if (message.type === 'USER_EXTERNAL_LOGOUT') {
          console.log('🚪 Logout:', message);
          const loggedOutUser = logoutMsg.payload.user;
          setAuthenticatedUsers(prev => {
            const filtered = prev.filter(user => user.login !== loggedOutUser.login);
            return filtered;
          });
        }
        if (message.type === 'USER_EXTERNAL_LOGIN') {
          console.log('✅ Login:', message);
          const loginUser = login.payload.user;
          setAuthenticatedUsers(prev => [...prev, loginUser]);
        }
      }
    };
    const unsubscribe = ws.onMessage(handleServerEvents);
    return () => unsubscribe();
  }, [ws]);

  const getAuthUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await new Promise<AuthenticatedUsersResponse>((resolve, reject) => {
        const requestId = userData.id;

        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Timeout'));
        }, 5000);

        const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
          if (isLoginResponse(message, requestId)) {
            clearTimeout(timeout);
            unsubscribe();
            resolve(message);
          }
        });

        ws.sendMessage({
          id: requestId,
          type: 'USER_ACTIVE',
          payload: null,
        });
      });

      if (response.payload?.users) {
        setAuthenticatedUsers(response.payload.users);
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';

      console.error('❌ Ошибка входа:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ws, userData?.id]);

  useEffect(() => {
    if (ws && userData?.id) {
      getAuthUsers();
    }
  }, [ws, userData?.id, getAuthUsers]);

  return {
    loading,
    authenticatedUsers,
    getAuthUsers,
  };
};
