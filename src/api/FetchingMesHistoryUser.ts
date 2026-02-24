import type {
  WebSocketMessage,
  MessageHistoryWithUserResponse,
  HistoryMessage,
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import { isServerError } from '../types/errorsType';
import { useState, useCallback } from 'react';
import { useWSData } from '../hooks/useWSData';

const isMessageHistory = (
  message: WebSocketMessage,
  requestId: string
): message is MessageHistoryWithUserResponse => {
  return message.type === 'MSG_FROM_USER' && message.id === requestId;
};

export const useFetchingMessageHistory = () => {
  const ws = useWSData();
  const [messagesHistory, setMessagesHistory] = useState<HistoryMessage[]>([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [historyMessageError, setHistoryMessageError] = useState<string | null>(null);

  const getUserHistoryMessage = useCallback(
    async (loginSelectedUser: string) => {
      setMessagesHistory([]);
      setLoadingMessage(true);
      setHistoryMessageError(null);
      try {
        const requestId = generateRequestId();
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

        if (response.payload.messages) {
          setMessagesHistory(response.payload.messages);
          setLoadingMessage(false);
          return true;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        setHistoryMessageError(errorMessage);
        console.error('❌ Ошибка истории:', errorMessage);
        return false;
      } finally {
        setLoadingMessage(false);
      }
    },
    [ws]
  );
  return {
    messagesHistory,
    loadingMessage,
    historyMessageError,
    getUserHistoryMessage,
  };
};
