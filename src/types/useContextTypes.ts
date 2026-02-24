import type {HistoryMessage} from './websocketTypes'
export interface UserData {
  login: string;
  id: string;
}
export interface LoginDataContextType {
  userData: UserData;
  setData: (updates: Partial<UserData>) => void;
  clearData: () => void;
}

export interface SelectedMemberContextType {
  member: SelectedMember | null;
  setData: (updates: SelectedMember) => void;
  messagesHistory: HistoryMessage[];
  loadingMessage: boolean;
}

export interface SelectedMember {
  login: string;
}