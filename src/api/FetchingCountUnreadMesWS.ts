import type {
  WebSocketMessage,
  FetchingCountUnreadMessagesWithUserResponse,
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import { isServerError } from '../types/errorsType';
import { useCallback } from 'react';
import { useWSData } from '../hooks/useWSData';
import { useAppDispatch } from '../store/hooks';
import { setUnreadCount } from '../store/features/members/membersSlice';

const isCountMsg = (
  message: WebSocketMessage,
  requestId: string
): message is FetchingCountUnreadMessagesWithUserResponse => {
  return message.type === 'MSG_COUNT_NOT_READED_FROM_USER' && message.id === requestId;
};

export const useFetchingCountUnreadMes = () => {
  const ws = useWSData();
  const dispatch = useAppDispatch();
  const getCountUnreadMes = useCallback(
    async (userLogin: string) => {
      try {
        const requestId = generateRequestId();
        const response = await new Promise<FetchingCountUnreadMessagesWithUserResponse>((resolve, reject) => {
          const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
            if (isCountMsg(message, requestId)) {
              unsubscribe();
              resolve(message);
            } else if (isServerError(message, requestId)) {
              unsubscribe();
              reject(new Error(message.payload.error));
            }
          });
          ws.sendMessage({
            id: requestId,
            type: 'MSG_COUNT_NOT_READED_FROM_USER',
            payload: {
              user: {
                login: userLogin,
              },
            },
          });
        });

        if (response.payload.count !== undefined && response.payload.count !== null) {
          dispatch(setUnreadCount({ login: userLogin, count: response.payload.count }))
          return true;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('❌ Ошибка истории:', errorMessage);
        return false;
      }
    },
    [ws, dispatch]
  );

  return {
    getCountUnreadMes,
  };
};
