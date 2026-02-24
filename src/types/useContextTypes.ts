export interface UserData {
  login: string;
  id: string;
}
export interface LoginDataContextType {
  userData: UserData;
  setData: (updates: Partial<UserData>) => void;
  clearData: () => void;
}