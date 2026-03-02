import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  login: string;
  isLogined: boolean;
}

interface MembersState {
  authenticatedUsers: User[];
  unauthenticatedUsers: User[];
  
  unreadCounts: Record<string, number>;
  loading: boolean;
}

const initialState: MembersState = {
  authenticatedUsers: [],
  unauthenticatedUsers: [],
  unreadCounts: {},
  loading: false,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAuthenticatedUsers(state, action: PayloadAction<User[]>) {
      state.authenticatedUsers = action.payload;
    },


    setUnauthenticatedUsers(state, action: PayloadAction<User[]>) {
      state.unauthenticatedUsers = action.payload;
    },


    userLoggedIn(state, action: PayloadAction<User>) {
      state.unauthenticatedUsers = state.unauthenticatedUsers
        .filter(u => u.login !== action.payload.login);

      const exists = state.authenticatedUsers.some(u => u.login === action.payload.login);
      if (!exists) {
        state.authenticatedUsers.push(action.payload);
      }
    },


    userLoggedOut(state, action: PayloadAction<User>) {
      state.authenticatedUsers = state.authenticatedUsers
        .filter(u => u.login !== action.payload.login);

      const exists = state.unauthenticatedUsers.some(u => u.login === action.payload.login);
      if (!exists) {
        state.unauthenticatedUsers.push(action.payload);
      }
    },


    setUnreadCount(state, action: PayloadAction<{ login: string; count: number }>) {
      state.unreadCounts[action.payload.login] = action.payload.count;
    },


    clearUnreadCount(state, action: PayloadAction<string>) {
      state.unreadCounts[action.payload] = 0;
    },

    incrementUnreadCount(state, action: PayloadAction<string>) {
      const login = action.payload;
      state.unreadCounts[login] = (state.unreadCounts[login] ?? 0) + 1;
},
  },
});

export const {
  setAuthenticatedUsers,
  setUnauthenticatedUsers,
  userLoggedIn,
  userLoggedOut,
  setUnreadCount,
  clearUnreadCount,
  incrementUnreadCount,
} = membersSlice.actions;

export default membersSlice.reducer;