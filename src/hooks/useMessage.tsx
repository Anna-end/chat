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
  onSend: (text: string, id: string) => Promise<void>;
}

export const useMessages = ({
  messagesHistory,
  messageData,
  memberLogin,
  currentUserLogin,
  onSend,
}: UseMessagesProps) => {
  const [sentMessages, setSentMessages] = useState<Record<string, Message[]>>({});
  const [sendError, setSendError] = useState<string | null>(null);

  const allMessages = useMemo(() => {
    const history: Message[] = messagesHistory.map(msg => ({
      id: msg.id,
      text: msg.text,
      from: msg.from,
      time: String(msg.datetime),
    }));

    const incoming: Message[] = messageData.map(msg => ({
      id: msg.payload.message.id,
      text: msg.payload.message.text,
      from: msg.payload.message.from,
      time: String(msg.payload.message.datetime),
    }));

    const sent = sentMessages[memberLogin ?? ''] ?? [];

    return deduplicateAndSort([...history, ...incoming, ...sent]);
  }, [messagesHistory, messageData, sentMessages, memberLogin]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !memberLogin) return;

    const id = generateRequestId();
    const optimisticMessage: Message = {
      id,
      text,
      from: currentUserLogin,
      time: String(Date.now()),
    };

    setSentMessages(prev => ({
      ...prev,
      [memberLogin]: [...(prev[memberLogin] ?? []), optimisticMessage],
    }));
    setSendError(null);

    try {
      await onSend(text, id);
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
