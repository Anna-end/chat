import { useState, useMemo } from 'react';
import type {
  HistoryMessage,
  ReceivingMessageFromUser,
} from '../types/websocketTypes';
import {generateRequestId} from '../utils/generateRequestId'

interface Message {
  id: string;
  text: string;
  from: string;
  time: string;
   status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

const deduplicateAndSort = (messages: Message[]): Message[] => {
  const unique = new Map(messages.map(m => [m.id, m]));
  return Array.from(unique.values()).sort((a, b) => Number(a.time) - Number(b.time));
};

interface UseMessagesProps {
  messagesHistory: HistoryMessage[];
  messageData: ReceivingMessageFromUser[];
  memberLogin: string | undefined;
  currentUserLogin: string;
 onSend: (text: string, id: string) => Promise<HistoryMessage | undefined>; 
  statuses: Record<string, { isDelivered?: boolean; isReaded?: boolean }>;
}

export const useMessages = ({
  messagesHistory,
  messageData,
  memberLogin,
  currentUserLogin,
  onSend,
  statuses
}: UseMessagesProps) => {
  const [sentMessages, setSentMessages] = useState<Record<string, Message[]>>({});
  const [sendError, setSendError] = useState<string | null>(null);

  const allMessages = useMemo(() => {
  const history: Message[] = messagesHistory.map(msg => ({
    id: msg.id,
    text: msg.text,
    from: msg.from,
    time: String(msg.datetime),
    status: msg.status,
  }));

  const incoming: Message[] = messageData.map(msg => ({
    id: msg.payload.message.id,
    text: msg.payload.message.text,
    from: msg.payload.message.from,
    time: String(msg.payload.message.datetime),
    status: msg.payload.message.status,
  }));

  const sent = sentMessages[memberLogin ?? ''] ?? [];


  return deduplicateAndSort([...sent, ...incoming, ...history]).map(msg => ({
  ...msg,
  status: {
    ...msg.status,
    isDelivered: statuses[msg.id]?.isDelivered ?? msg.status.isDelivered,
    isReaded: statuses[msg.id]?.isReaded ?? msg.status.isReaded,
  },
}));
}, [messagesHistory, messageData, sentMessages, memberLogin, statuses]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !memberLogin) return;

    const id = generateRequestId();
    const optimisticMessage: Message = {
      id,
      text,
      from: currentUserLogin,
      time: String(Date.now()),
      status: {
    isDelivered: false,
    isReaded: false,
    isEdited: false,
  },
    };

    setSentMessages(prev => ({
      ...prev,
      [memberLogin]: [...(prev[memberLogin] ?? []), optimisticMessage],
    }));
    setSendError(null);

    try {
      const serverMessage = await onSend(text, id);
       if (serverMessage) {
      setSentMessages(prev => ({
        ...prev,
        [memberLogin]: (prev[memberLogin] ?? []).map(m =>
          m.id === id ? { ...m, id: serverMessage.id, status: serverMessage.status } : m
        ),
      }));
    }
    } catch {
      setSentMessages(prev => ({
        ...prev,
        [memberLogin]: (prev[memberLogin] ?? []).filter(m => m.id !== id),
      }));
      setSendError('Не удалось отправить сообщение');
    }
  };

  return { allMessages, sendMessage, sendError };
};
