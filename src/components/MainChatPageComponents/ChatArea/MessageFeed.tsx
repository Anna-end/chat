import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBuble';

interface Message {
  id: string;
  text: string;
  from: string;
  time: string;
}

interface MessageFeedProps {
  messages: Message[];
  currentUserLogin: string;
  isLoading: boolean;
}

export const MessageFeed = ({ messages, currentUserLogin, isLoading }: MessageFeedProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return <p className="text-center pt-8">Загрузка...</p>;
  }

  if (messages.length === 0) {
    return <p className="text-center opacity-60 pt-8">Нет сообщений</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <MessageBubble
          key={message.id}
          text={message.text}
          time={message.time}
          isMine={message.from === currentUserLogin}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};