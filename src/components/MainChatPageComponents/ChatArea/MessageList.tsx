import { useLoginData } from '../../../hooks/useLoginCurrentUser';
import { useSendMessage, useMessageServer } from '../../../api/messageSendWS';
import { useWSData } from '../../../hooks/useWSData';
import { useSelectedMember } from '../../../hooks/useSelectedMemberContext';
import { useMessages } from '../../../hooks/useMessage';
import { MessageFeed } from './MessageFeed';
import { MessageInput } from './MessageInput';

export const MessageList = () => {
  const ws = useWSData();
  const { userData } = useLoginData();
  const { sendMessage: wsSend } = useSendMessage(ws);
  const { messageData } = useMessageServer(ws);
  const { member, messagesHistory, loadingMessage } = useSelectedMember();

  const { allMessages, sendMessage, sendError } = useMessages({
    messagesHistory,
    messageData,
    memberLogin: member?.login,
    currentUserLogin: userData.login,
    onSend: async (text, id) => {
      await wsSend(text, id);
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
      <MessageInput onSend={sendMessage} error={sendError} />
    </>
  );
};
