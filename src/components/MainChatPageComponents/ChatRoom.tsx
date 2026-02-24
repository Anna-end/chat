import { ChatArea } from './ChatArea/ChatArea';
import { ParticipantSidebar } from './ParticipantSidebar/ParticipantSidebar';
export const ChatRoom = () => {
  return (
    <div className="w-9/12 h-3/4 justify-between mx-auto flex gap-0.5">
      <ParticipantSidebar />
      <ChatArea />
    </div>
  );
};