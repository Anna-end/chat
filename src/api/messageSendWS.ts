import { useState, useEffect } from 'react';
import type { 
  WebSocketInstance, 
  WebSocketMessage,
  ReceivingMessageFromUser,
  SendingMessageUserResponse, } from '../types/websocketTypes';

import { isServerError } from '../types/errorsType';
import { useSelectedMember } from '../hooks/useSelectedMemberContext';
import { useLoginData } from '../hooks/useLoginCurrentUser';

const isMessageResponse = (
  message: WebSocketMessage,
  requestId: string
): message is SendingMessageUserResponse => {
  return message.type === 'MSG_SEND' && message.id === requestId;
};

interface MessageResponse {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}
export const useMessageServer = (ws: WebSocketInstance) => {
  const [messageData, setMessageData] = useState<ReceivingMessageFromUser[]>([]); 
  const { member } = useSelectedMember();
  const { userData } = useLoginData();
  useEffect(() => {
    if (!ws) return;

    const handleServerEvents = (message: WebSocketMessage) => {
      console.log('📨 Получено сообщение:', message.type);

      if (message.type === 'MSG_SEND') {
        const messageServer = message as ReceivingMessageFromUser;

        if (
          messageServer.payload.message.from === member?.login &&
          messageServer.payload.message.to === userData.login
        ) {
          setMessageData(prev => [...prev, messageServer]);
        }
      }
    };

    const unsubscribe = ws.onMessage(handleServerEvents);

    return () => unsubscribe();
  }, [ws, member?.login, userData.login]);

  return { messageData };
};
export const useSendMessage = (ws: WebSocketInstance) => {
  const { member } = useSelectedMember();
  const [messageResponse, setMessageResponse] = useState<MessageResponse | null>();
  const [errorSendingMes, setErrorSendingMes] = useState<string | null>(null);
  const sendMessage = async (messageUser: string, id: string) => {
    if (!member) return;
    try {
      const response = await new Promise<SendingMessageUserResponse>((resolve, reject) => {
        const requestId = id;

        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error('Timeout'));
        }, 5000);

        const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
          if (isMessageResponse(message, requestId)) {
            clearTimeout(timeout);
            unsubscribe();
            resolve(message);
          } else if (isServerError(message, requestId)) {
            clearTimeout(timeout);
            unsubscribe();
            reject(new Error(message.payload.error));
          }
        });

        ws.sendMessage({
          id: id,
          type: 'MSG_SEND',
          payload: {
            message: {
              to: member.login,
              text: messageUser,
            },
          },
        });
      });

      if (response.payload?.message.id) {
        setMessageResponse(response.payload.message);
        return response.payload.message;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setErrorSendingMes(errorMessage);
      console.error('❌ Ошибка входа:', errorMessage);
      return false;
    }
  };
  return { sendMessage, messageResponse, errorSendingMes };
};
