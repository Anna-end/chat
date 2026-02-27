import type {
  WebSocketMessage,
  MessageReadStatusChangeResponse,
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import { isServerError } from '../types/errorsType';
import { useState, useCallback } from 'react';
import { useWSData } from '../hooks/useWSData';

const isCountMsg = (
  message: WebSocketMessage,
  requestId: string
): message is MessageReadStatusChangeResponse => {
  return message.type === 'MSG_READ' && message.id === requestId;
};

export const useReadStatus = () => {
  const ws = useWSData();
  const [statusMessages, setStatusMessages] = useState<boolean>(false);
  

  const getReadMes = useCallback(
    async (id: string) => {
      try {
        const requestId = generateRequestId();
        const response = await new Promise<MessageReadStatusChangeResponse>((resolve, reject) => {
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
            type: 'MSG_READ',
            payload: {
              message: {
                id: id,
                }
            },
          });
        });

        if (response.payload.message !== undefined && response.payload.message !== null) {
          setStatusMessages(response.payload.message.status.isReaded);
          return true;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('❌ Ошибка истории:', errorMessage);
        return false;
      }
    },
    [ws]
  );

  return {
    statusMessages,
    getReadMes,
  };
};
