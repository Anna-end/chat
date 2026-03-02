import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { HistoryMessage } from '../../../types/websocketTypes';

interface Message {
  id: string;
  text: string;
  from: string;
  time: string;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
  isPending?: boolean;
  isFailed?: boolean;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  reconnectAttempt: number;
  loading: boolean;
}

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  reconnectAttempt: 0,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },

    setReconnectAttempt(state, action: PayloadAction<number>) {
      state.reconnectAttempt = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setMessageHistory(state, action: PayloadAction<HistoryMessage[]>) {
      const incoming = action.payload.map(historyMessageToMessage);
      const pending = state.messages.filter(m => m.isPending);
      state.messages = deduplicateAndSort([...incoming, ...pending]);
    },

    addOptimisticMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },

    confirmMessage(
      state,
      action: PayloadAction<{ tempId: string; serverMessage: HistoryMessage }>
    ) {
      const idx = state.messages.findIndex(m => m.id === action.payload.tempId);
      if (idx !== -1) {
        state.messages[idx] = historyMessageToMessage(action.payload.serverMessage);
      }
    },

    markMessageFailed(state, action: PayloadAction<string>) {
      const msg = state.messages.find(m => m.id === action.payload);
      if (msg) {
        msg.isPending = false;
        msg.isFailed = true;
      }
    },

    addIncomingMessage(state, action: PayloadAction<HistoryMessage>) {
      const exists = state.messages.some(m => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(historyMessageToMessage(action.payload));
        state.messages = deduplicateAndSort(state.messages);
      }
    },

    updateMessageStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: Partial<Message['status']>;
      }>
    ) {
      const msg = state.messages.find(m => m.id === action.payload.id);
      if (msg) {
        msg.status = { ...msg.status, ...action.payload.status };
      }
    },

    clearMessages(state) {
      state.messages = [];
    },
  }
})

function historyMessageToMessage(msg: HistoryMessage): Message {
  return {
    id: msg.id,
    text: msg.text,
    from: msg.from,
    time: String(msg.datetime),
    status: msg.status,
  };
}

function deduplicateAndSort(messages: Message[]): Message[] {
  const unique = new Map(messages.map(m => [m.id, m]));
  return Array.from(unique.values()).sort((a, b) => Number(a.time) - Number(b.time));
}

export const {
  setLoading,
  setConnected,
  setReconnectAttempt,
  setMessageHistory,
  addOptimisticMessage,
  confirmMessage,
  markMessageFailed,
  addIncomingMessage,
  updateMessageStatus,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;