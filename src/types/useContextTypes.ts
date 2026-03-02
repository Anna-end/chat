export interface UserData {
  login: string;
}
export interface LoginDataContextType {
  userData: UserData;
  setData: (updates: Partial<UserData>) => void;
  clearData: () => void;
}

export interface SelectedMemberContextType {
  member: SelectedMember | null;
  setData: (updates: SelectedMember) => void;
}

export interface SelectedMember {
  login: string;
}