import { useCallback } from 'react';
import type {
  HistoryMessage,
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'
import {useAppDispatch} from '../store/hooks';
import {useAppSelector} from '../store/hooks';
import {addOptimisticMessage, confirmMessage, markMessageFailed} from '../store/features/chat/chatSlice'
interface UseMessagesProps {
  memberLogin: string | undefined;
  currentUserLogin: string;
 onSend: (text: string, id: string) => Promise<HistoryMessage | undefined>;
}

export const useMessages = ({
  memberLogin,
  currentUserLogin,
  onSend,
}: UseMessagesProps) => {
  const dispatch = useAppDispatch();
  const allMessages = useAppSelector(state => state.chat.messages);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !memberLogin) return;
     const tempId = generateRequestId();

    dispatch(addOptimisticMessage({
    id: tempId,
    text,
    from: currentUserLogin,
    time: String(Date.now()),
    status: { isDelivered: false, isReaded: false, isEdited: false },
    isPending: true,
  }));
  
    try {
      const serverMessage = await onSend(text, tempId);
      if (serverMessage) {
        dispatch(confirmMessage({ tempId, serverMessage }));
      } 
    } catch {
      dispatch(markMessageFailed(tempId));
    }
  }, [dispatch, memberLogin, currentUserLogin, onSend])
  return { allMessages, sendMessage }
}