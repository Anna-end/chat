import type { WebSocketMessage,MessageHistoryWithUserResponse } from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import { isServerError } from '../types/errorsType';
import {  useCallback } from 'react';
import { useWSData } from '../hooks/useWSData';
import { useAppDispatch } from '../store/hooks';
import { setMessageHistory, setLoading, clearMessages} from '../store/features/chat/chatSlice';

const isMessageHistory = (
  message: WebSocketMessage,
  requestId: string
): message is MessageHistoryWithUserResponse => {
  return message.type === 'MSG_FROM_USER' && message.id === requestId;
};

export const useFetchingMessageHistory = () => {
  const ws = useWSData();
  const dispatch = useAppDispatch();
  const requestId = generateRequestId();
  const getUserHistoryMessage = useCallback(
    async (loginSelectedUser: string) => {
      dispatch(setLoading(true));
      dispatch(clearMessages());
      try {
        
        const response = await new Promise<MessageHistoryWithUserResponse>((resolve, reject) => {
          const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
            if (isMessageHistory(message, requestId)) {
              unsubscribe();
              resolve(message);
            } else if (isServerError(message, requestId)) {
              unsubscribe();
              reject(new Error(message.payload.error));
            }
          });
          ws.sendMessage({
            id: requestId,
            type: 'MSG_FROM_USER',
            payload: {
              user: {
                login: loginSelectedUser,
              },
            },
          });
        });

        if (response.payload.messages && response.id === requestId) {
          dispatch(setMessageHistory(response.payload.messages))
          return true;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('❌ Ошибка истории:', errorMessage);
        return false;
      }
      finally {
        dispatch(setLoading(false)); // ←
      }
    }, [ws, dispatch, requestId])
  return {
    getUserHistoryMessage,
  };
  };

