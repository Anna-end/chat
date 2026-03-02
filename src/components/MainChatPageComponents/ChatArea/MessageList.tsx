import { useLoginData } from '../../../hooks/useLoginCurrentUser';
import { useSendMessage } from '../../../api/messageSendWS';
import { useWSData } from '../../../hooks/useWSData';
import { useSelectedMember } from '../../../hooks/useSelectedMemberContext';
import { useMessages } from '../../../hooks/useMessage';
import { MessageFeed } from './MessageFeed';
import { MessageInput } from './MessageInput';
import { useMessageServer } from '../../../api/messageSendWS';
import { useAppSelector } from '../../../store/hooks';

export const MessageList = () => {
  const ws = useWSData();
  const { userData } = useLoginData();
  const { sendMessage: wsSend } = useSendMessage(ws);
  const { member } = useSelectedMember(); // убрали loadingMessage
  
  const loadingMessage = useAppSelector(state => state.chat.loading); // ← из стора
  
  useMessageServer(ws);

  const { allMessages, sendMessage } = useMessages({
    memberLogin: member?.login,
    currentUserLogin: userData.login,
    onSend: async (text, id) => {
      const result = await wsSend(text, id);
      if (result && typeof result === 'object') return result;
    },
  });

  if (member === null) {
    return <h1 className="text-4xl text-center pt-20">Выберите пользователя</h1>;
  }

  return (
    <>
      <MessageFeed
        messages={allMessages}
        currentUserLogin={userData.login}
        isLoading={loadingMessage}
      />
      <MessageInput onSend={sendMessage} />
    </>
  );
};