import { ChatArea } from './ChatArea/ChatArea';
import { ParticipantSidebar } from './ParticipantSidebar/ParticipantSidebar';
import { useMessageServer } from '../../api/messageSendWS';
import { useMessageStatuses } from '../../api/haandleMessageServer';
import { useWSData } from '../../hooks/useWSData';
export const ChatRoom = () => {
  const ws = useWSData();
  
  useMessageServer(ws);
  useMessageStatuses(ws);

  return (
    <div className="w-9/12 h-3/4 justify-between mx-auto flex gap-0.5">
      <ParticipantSidebar />
      <ChatArea />
    </div>
  );
};