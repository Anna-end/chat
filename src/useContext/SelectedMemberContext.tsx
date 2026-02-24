import { useState } from 'react';
import type { ReactNode } from 'react';
import {SelectedMemberContext} from './Contexts';
import type { SelectedMemberContextType, SelectedMember } from '../types/useContextTypes';
import { useFetchingMessageHistory } from '../api/FetchingMesHistoryUser';

export function SelectedMemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<SelectedMember | null>(null);
  const { messagesHistory, loadingMessage, getUserHistoryMessage } = useFetchingMessageHistory();
  const setData = (updates: SelectedMember) => {
    setMember(updates);
    getUserHistoryMessage(updates.login);
  };

  const value: SelectedMemberContextType = {
    member,
    setData,
    messagesHistory,
    loadingMessage,
  };

  return <SelectedMemberContext.Provider value={value}>{children}</SelectedMemberContext.Provider>;
}