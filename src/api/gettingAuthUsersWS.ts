import { useCallback, useEffect } from 'react';
import type {
  WebSocketInstance,
  WebSocketMessage,
  AuthenticatedUsersResponse,
  UserLogoutServer,
  UserLoginServer,
  UnauthorizedUsersResponse
} from '../types/websocketTypes';
import { useLoginData } from '../hooks/useLoginCurrentUser';
import { generateRequestId } from '../utils/generateRequestId';
import { useAppDispatch } from '../store/hooks';
import { userLoggedOut, userLoggedIn, setAuthenticatedUsers, setUnauthenticatedUsers } from '../store/features/members/membersSlice';

const isLoginResponse = (
  message: WebSocketMessage,
  requestId: string
): message is AuthenticatedUsersResponse => {
  return message.type === 'USER_ACTIVE' && message.id === requestId;
};

const isUnauthResponse = (
  message: WebSocketMessage,
  requestId: string
): message is UnauthorizedUsersResponse => {
  return message.type === 'USER_INACTIVE' && message.id === requestId;
};

const isUserEvent = (message: WebSocketMessage): boolean => {
  return message.type === 'USER_EXTERNAL_LOGOUT' || message.type === 'USER_EXTERNAL_LOGIN';
};

export const useAuthUsers = (ws: WebSocketInstance) => {
  const dispatch = useAppDispatch();
  const { userData } = useLoginData();
// Прослушивание событий на логин и логаут пользователей в реальном времени
  useEffect(() => {
    if (!ws) return;

    const handleServerEvents = (message: WebSocketMessage) => {
      if (isUserEvent(message)) {
        const logoutMsg = message as UserLogoutServer;
        const login = message as UserLoginServer;
        if (message.type === 'USER_EXTERNAL_LOGOUT') {
         dispatch(userLoggedOut(logoutMsg.payload.user));
        }
        if (message.type === 'USER_EXTERNAL_LOGIN') {
          dispatch(userLoggedIn(login.payload.user));
        }
      }
    };
    const unsubscribe = ws.onMessage(handleServerEvents);
    return () => unsubscribe();
  }, [ws, dispatch]);
// получение списка залогиненых пользователей 
  const getAuthUsers = useCallback(async () => {
    try {
      const requestId = generateRequestId();
      const response = await new Promise<AuthenticatedUsersResponse>((resolve, reject) => {
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
        dispatch(setAuthenticatedUsers(response.payload.users));
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';

      console.error('❌ Ошибка входа:', errorMessage);
      return false;
    }
  }, [ws, dispatch]);

  useEffect(() => {
    if (ws && userData?.login) {
      getAuthUsers();
    }
  }, [ws, userData?.login, getAuthUsers]);

  // Получение не залогиненых пользователей
   const getUnauthUsers = useCallback(async () => {
    try {
      const response = await new Promise<UnauthorizedUsersResponse>((resolve, reject) => {
        const requestId = generateRequestId();

        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Timeout'));
        }, 5000);

        const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
          if (isUnauthResponse(message, requestId)) {
            clearTimeout(timeout);
            unsubscribe();
            resolve(message);
          }
        });

        ws.sendMessage({
          id: requestId,
          type: 'USER_INACTIVE',
          payload: null,
        });
      });

      if (response.payload?.users) {
        dispatch(setUnauthenticatedUsers(response.payload.users));
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';

      console.error('❌ Ошибка входа:', errorMessage);
      return false;
    }
  }, [ws, dispatch]);

  useEffect(() => {
    if (ws && userData?.login) {
      getUnauthUsers();

    }
  }, [ws, userData?.login]);

  return {
    getAuthUsers,
    getUnauthUsers
  };
};
