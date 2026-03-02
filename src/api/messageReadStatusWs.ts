import type {
  WebSocketMessage,
  MessageReadStatusChangeResponse,
  WebSocketInstance,
  NotificationMessageReadStatusChange
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import { isServerError } from '../types/errorsType';
import { useCallback } from 'react';
import { useWSData } from '../hooks/useWSData';
import { useAppDispatch } from '../store/hooks';
import { updateMessageStatus } from '../store/features/chat/chatSlice';
import { clearUnreadCount } from '../store/features/members/membersSlice'
import { useSelectedMember } from '../hooks/useSelectedMemberContext';
import {useEffect} from 'react';
const isCountMsg = (
  message: WebSocketMessage,
  requestId: string
): message is MessageReadStatusChangeResponse => {
  return message.type === 'MSG_READ' && message.id === requestId;
};

export const useReadStatus = () => {
  const ws = useWSData();
  const dispatch = useAppDispatch();
  const { member } = useSelectedMember();

  const memberLogin = member?.login; 
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
          dispatch(updateMessageStatus({
            id: response.payload.message.id,
            status: response.payload.message.status,}));

            if (memberLogin) {
          dispatch(clearUnreadCount(memberLogin));
        }
          return true;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('❌ Ошибка истории:', errorMessage);
        return false;
      }
    },
    [ws, dispatch, memberLogin]
  );

  return {
    getReadMes,
  };
};

export const useMessageStatuses = (ws: WebSocketInstance) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!ws) return;

    const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
      if (message.type === 'MSG_READ' && message.id === null) {
         const messageServer = message as NotificationMessageReadStatusChange;
        dispatch(updateMessageStatus({
            id: messageServer.payload.message.id,
            status: messageServer.payload.message.status,}))
      }
    });

    return () => unsubscribe();
  }, [ws, dispatch]);

  return { };
};