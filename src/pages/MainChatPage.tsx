import { Header } from '../components/MainChatPageComponents/Header';
import { ChatRoom } from '../components/MainChatPageComponents/ChatRoom';
export function MainChatPage() {
  return (
    <div className="max-w-5/6  mx-auto  h-4/5 flex flex-col gap-3.5 items-center justify-start bg-[#721E1E] p-4 rounded-lg shadow border">
      <Header />
      <ChatRoom />
    </div>
  );
}