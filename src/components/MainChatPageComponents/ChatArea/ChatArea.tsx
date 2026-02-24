import { HeaderChatArea } from './HeaderChatArea';
import { MessageList } from './MessageList';
export const ChatArea = () => {
  return (
    <div
      className="flex flex-col w-8/12 h-4/5 rounded-lg shadow-xl shadow-black/50 "
      style={{ backgroundColor: '#E2D797' }}
    >
      <HeaderChatArea />
      <MessageList />
    </div>
  );
};