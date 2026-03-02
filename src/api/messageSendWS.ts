import { useEffect } from 'react';
import type { 
  WebSocketInstance, 
  WebSocketMessage,
  ReceivingMessageFromUser,
  SendingMessageUserResponse, } from '../types/websocketTypes';

import { isServerError } from '../types/errorsType';
import { useSelectedMember } from '../hooks/useSelectedMemberContext';
import { useLoginData } from '../hooks/useLoginCurrentUser';
import { useAppDispatch } from '../store/hooks';
import { confirmMessage, markMessageFailed, addIncomingMessage, updateMessageStatus } from '../store/features/chat/chatSlice';
import {incrementUnreadCount} from '../store/features/members/membersSlice';
const isMessageResponse = (
  message: WebSocketMessage,
  requestId: string
): message is SendingMessageUserResponse => {
  return message.type === 'MSG_SEND' && message.id === requestId;
};
// Подписка на сообщения от других пользователеей 
export const useMessageServer = (ws: WebSocketInstance) => {
  const dispatch = useAppDispatch();
  const { member } = useSelectedMember();
  const { userData } = useLoginData();

  useEffect(() => {
    if (!ws) return;

    const handleServerEvents = (message: WebSocketMessage) => {
      if (message.type === 'MSG_SEND') {
        const messageServer = message as ReceivingMessageFromUser;
        const { from, to } = messageServer.payload.message;

        if (messageServer.id === null && to === userData.login) {
          if (from === member?.login) {
            dispatch(addIncomingMessage(messageServer.payload.message));
          } else {
            dispatch(incrementUnreadCount(from));
          }
        }
      }
    };

    const unsubscribe = ws.onMessage(handleServerEvents);
    return () => unsubscribe();
  }, [ws, member?.login, userData.login, dispatch]);

  return {};
};

// Отправка сообщения пользователем 
export const useSendMessage = (ws: WebSocketInstance) => {
  const { member } = useSelectedMember();
   const dispatch = useAppDispatch();
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
      if (response.id === id) {
        const serverMessage = response.payload.message;
        dispatch(confirmMessage({tempId: response.id, serverMessage }));
        dispatch(updateMessageStatus({
          id: serverMessage.id,
          status: {
            isDelivered: serverMessage.status.isDelivered,
            isReaded: serverMessage.status.isReaded,
            isEdited: serverMessage.status.isEdited,
          }
        }));
        return response.payload.message;
      }
      dispatch(markMessageFailed(id))
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('❌ Ошибка отправки:', errorMessage);
      dispatch(markMessageFailed(id));
      return false;
    }
  } 
  
  return { sendMessage };
};
