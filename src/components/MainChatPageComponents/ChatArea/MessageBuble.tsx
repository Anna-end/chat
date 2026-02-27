import { Check, CheckCheck, Clock } from 'lucide-react';
interface MessageBubbleProps {
  text: string;
  time: string;
  isMine: boolean;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}
const formatTime = (time: string | number) => {
  const date = new Date(Number(time));

  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};
export const MessageBubble = ({ text, time, isMine, status }: MessageBubbleProps) => {
  
  const renderStatus = () => {
    if (!isMine) return null;
    
    if (status.isReaded) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
    if (status.isDelivered) {
      return <Check className="w-3 h-3 text-gray-400" />;
    }
    return <Clock className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
          isMine ? 'rounded-br-none' : 'rounded-bl-none'
        }`}
        style={{
          backgroundColor: isMine ? '#721E1E' : '#ffffff',
          color: isMine ? '#E2D797' : '#1f2937',
        }}
      >
        <p className="text-sm">{text}</p>
        <div className="flex justify-end items-center mt-1 gap-1">
          <span className="text-xs opacity-70">{formatTime(time)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};